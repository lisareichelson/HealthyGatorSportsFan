import os
import cfbd
import pytz
from django.core.management.base import BaseCommand
from datetime import date, datetime
class Command(BaseCommand):
    help = 'Polls CFBD API for game updates'

    def handle(self, *args, **options):
        self.poll_cfbd()

    def poll_cfbd(self):
        configuration = cfbd.Configuration(
            host="https://apinext.collegefootballdata.com",
            access_token=os.getenv('COLLEGE_FOOTBALL_API_KEY')
        )
        apiInstance = cfbd.GamesApi(cfbd.ApiClient(configuration))

        def get_next_game():
            # TODO: Test games that occur in 2025 but still happen in 2024 season
            current_year = date.today().year
            games = apiInstance.get_games(year=current_year, team='Florida', conference='SEC')
            today = datetime.combine(date.today(), datetime.min.time())
            future_games = [game for game in games if game.start_date.replace(tzinfo=None) > today]
            return min(future_games, key=lambda x: x.start_date) if future_games else None

        next_game = get_next_game()
        if next_game:
            user_tz = pytz.timezone('America/New_York')  # TODO: Get user's timezone from database
            game_time = next_game.start_date.astimezone(user_tz)
            print(f"Teams: {next_game.home_team} vs {next_game.away_team}")
            print(f"Date: {game_time.strftime('%m-%d-%Y %I:%M %p')}")
        else:
            print("No upcoming games found.")
