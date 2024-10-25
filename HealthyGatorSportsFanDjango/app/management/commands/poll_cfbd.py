import os
import cfbd
from django.core.management.base import BaseCommand
from datetime import date, datetime
class Command(BaseCommand):
    help = 'Polls CFBD API for game updates'

    async def handle(self, *args, **options):
        await self.poll_cfbd()

    async def poll_cfbd(self):
        configuration = cfbd.Configuration(
            host="https://apinext.collegefootballdata.com",
            access_token=os.getenv('COLLEGE_FOOTBALL_API_KEY')
        )
        apiInstance = cfbd.GamesApi(cfbd.ApiClient(configuration))

        async def get_next_game():
            # Note: Need to test games that occur in 2025 but still happen in 2024 season
            current_year = date.today().year
            games = apiInstance.get_games(year=current_year, team='Florida', conference='SEC')
            today = datetime.combine(date.today(), datetime.min.time())
            future_games = [game for game in games if game.start_date.replace(tzinfo=None) > today]
            return min(future_games, key=lambda x: x.start_date) if future_games else None

        next_game = await get_next_game()

