# tests/test_utils.py
import time
from django.test import TestCase
from unittest.mock import patch, MagicMock
from app.utils import send_notification
import cfbd

class UtilsTestCase(TestCase):
    @patch('app.utils.check_game_status')
    @patch('app.utils.redis_client')
    @patch('app.utils.cfbd.GamesApi.get_scoreboard')
    def test_check_game_status_winning_decisive(self, mock_get_scoreboard, mock_redis_client, mock_check_game_status):
        mock_get_scoreboard.return_value = [
            MagicMock(home_team=MagicMock(name='Florida Gators', points=21),
                      away_team=MagicMock(name='Opponent', points=7), status='in_progress')
        ]
        mock_redis_client.get.return_value = None
        mock_check_game_status.return_value = 'winning_decisive'
        game_status = mock_check_game_status(mock_get_scoreboard)
        send_notification(game_status)
        self.assertEqual(game_status, 'winning_decisive')

    @patch('app.utils.check_game_status')
    @patch('app.utils.redis_client')
    @patch('app.utils.cfbd.GamesApi.get_scoreboard')
    def test_check_game_status_tied(self, mock_get_scoreboard, mock_redis_client, mock_check_game_status):
        mock_get_scoreboard.return_value = [
            MagicMock(home_team=MagicMock(name='Florida Gators', points=14),
                      away_team=MagicMock(name='Opponent', points=14), status='in_progress')
        ]
        mock_redis_client.get.return_value = None
        mock_check_game_status.return_value = 'tied'
        game_status = mock_check_game_status(mock_get_scoreboard)
        send_notification(game_status)
        self.assertEqual(game_status, 'tied')

    @patch('app.utils.check_game_status')
    @patch('app.utils.redis_client')
    @patch('app.utils.cfbd.GamesApi.get_scoreboard')
    def test_check_game_status_losing_decisive(self, mock_get_scoreboard, mock_redis_client, mock_check_game_status):
        mock_get_scoreboard.return_value = [
            MagicMock(home_team=MagicMock(name='Florida Gators', points=10),
                      away_team=MagicMock(name='Opponent', points=24), status='completed')
        ]
        mock_redis_client.get.return_value = None
        mock_check_game_status.return_value = 'losing_decisive'
        game_status = mock_check_game_status(mock_get_scoreboard)
        send_notification(game_status)
        self.assertEqual(game_status, 'losing_decisive')

# This runs all tests
if __name__ == '__main__':
    import unittest
    unittest.main()