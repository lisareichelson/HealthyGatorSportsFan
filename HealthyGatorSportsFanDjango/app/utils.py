# app/utils.py
from exponent_server_sdk import PushClient, PushMessage
import os
import cfbd
import redis

redis_client = redis.StrictRedis.from_url('redis://localhost:6379/0')
def send_push_notification_next_game(header, push_token, message):
    response = PushClient().publish(
        PushMessage(
            to=push_token,
            title=header,
            body=message,
        )
    )
def check_game_status(apiInstance):
    scoreboard = apiInstance.get_scoreboard()
    curr_team = 'Florida Gators'
    curr_game = None
    for game in scoreboard:
        if game.home_team.name == curr_team or game.away_team.name == curr_team:
            curr_game = game
            break
    if not curr_game:
        return "No game found"
    if curr_game.status == 'scheduled':
        return 'Game not started'
    if curr_game.home_team == curr_team:
        florida_score = curr_game.home_team.points
        opponent_score = curr_game.away_team.points
    else:
        florida_score = curr_game.away_team.points
        opponent_score = curr_game.home_team.points
    score_diff = florida_score - opponent_score
    if curr_game.status == 'in_progress':
        if score_diff > 14:
            return 'winning_decisive'
        elif 1 <= score_diff <= 14:
            return 'winning_close'
        elif score_diff == 0:
            return 'tied'
        elif -14 < score_diff <= -1:
            return 'losing_close'
        else:
            return 'losing_decisive'
    elif curr_game.status == 'completed':
        if score_diff > 14:
            return 'won_decisive'
        elif 1 <= score_diff <= 14:
            return 'won_close'
        elif -14 < score_diff <= -1:
            return 'lost_close'
        else:
            return 'lost_decisive'
    elif curr_game.status == 'scheduled':
        return 'Game not started'

def send_notification(game_status: str):
    #global last_score = 'Game not started'
    push_token = os.getenv('EXPO_PUSH_TOKEN')
    if push_token:
        message = {
            'predicted_win': "The Gators are predicted to win, and so are you! Plan wisely to meet your health goals this game day.",
            'predicted_lose': "Defeat the odds this game day by working hard to meet your health goals!",
            'winning_decisive': "The Gators are up, and you should be, too! Make sure you are up and moving to meet your health goals today.",
            'winning_close': "Don't let your guard down just yet! Keep working to meet your health goals for today's game!",
            'tied': "Florida is tied!",
            'losing_close': "The Gators won't back down, so why should you? Work hard to meet your health goals today!",
            'losing_decisive': "The game isn't lost yet, and neither are your goals! Try to make healthy choices the rest of the game!",
            'won_decisive': "When the Gators win, you win! Make this win count by meeting your health goals, too!",
            'won_close': "Match the Gator's energy by keeping up with your health goals for today!",
            'lost_close': "Don't let a loss get you down! Keep an eye on your health journey, instead!",
            'lost_decisive': "Just because the Gators lost doesn't mean you have to! Make healthy choices after the game!",
            'Game not started': "The game hasn't started yet. Get ready to meet your health goals when it does!"
        }[game_status]

        last_score = redis_client.get('last_score')
        if last_score is None:
            last_score = "Game not started"
        else:
            # Decode is needed here because Redis stores data as bytes, so we need to turn it back into a string
            last_score = last_score.decode('utf-8')

        if last_score != game_status:
            send_push_notification_next_game("Health Notification", push_token, message)
            redis_client.set('last_score', game_status)