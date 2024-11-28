# app/tasks.py
import logging
from celery import shared_task
#from project.celery import app
from app.views import poll_cfbd_view
from app.utils import check_game_status, send_notification
import os
import cfbd

logger = logging.getLogger(__name__)
# @app.on_after_configure.connect
# def setup_periodic_tasks(sender, **kwargs):
#     # Calls dynamic_polling every 5 minutes
#     sender.add_periodic_task(300.0, dynamic_polling.s(), name='dynamic polling every 5 minutes')

def setup_periodic_tasks(sender, **kwargs):
    logger.info('Starting periodic task scheduling')
    # Start dynamic_polling immediately and let it reschedule itself
    sender.add_periodic_task(
        10.0,  # Start after 10 seconds initial delay
        dynamic_polling.s(),
        name='initialize dynamic polling'
    )

@shared_task
def poll_cfbd_task():
    logger.info('Starting poll_cfbd_task')
    try:
        poll_cfbd_view(None)
        logger.info('Finished poll_cfbd_task successfully')
    except Exception as e:
        logger.error(f'Error in poll_cfbd_task: {e}', exc_info=True)


@shared_task(bind=True)
def dynamic_polling(self):
    logger.info('Starting dynamic_polling')
    try:
        configuration = cfbd.Configuration(
            host="https://apinext.collegefootballdata.com",
            access_token=os.getenv('COLLEGE_FOOTBALL_API_KEY')
        )
        apiInstance = cfbd.GamesApi(cfbd.ApiClient(configuration))
        game_status = check_game_status(apiInstance)

        if game_status in ['winning_decisive', 'winning_close', 'tied', 'losing_close', 'losing_decisive']:
            # Poll every 2 minutes during the game
            poll_interval = 120.0
        else:
            # Poll every hour when no game is occurring
            poll_interval = 3600.0

        logger.info(f"Set polling interval based on game status: {game_status}")

        # Run poll_cfbd_task normally
        poll_cfbd_task()

        # Schedule the next dynamic_polling task
        logger.info(f'Scheduling next dynamic_polling in {poll_interval} seconds')
        self.apply_async(countdown=poll_interval)
    except Exception as e:
        logger.error(f'Error in dynamic_polling: {e}', exc_info=True)


# # Schedule dynamic polling task to run every 5 minutes to check game status
# app.conf.beat_schedule['dynamic_polling'] = {
#     'task': 'app.tasks.dynamic_polling',
#     'schedule': 300.0,
# }

