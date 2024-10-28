# app/utils.py
from exponent_server_sdk import PushClient, PushMessage

def send_push_notification_next_game(push_token, message):
    response = PushClient().publish(
        PushMessage(
            to=push_token,
            title="Next Game Info",
            body=message,
        )
    )