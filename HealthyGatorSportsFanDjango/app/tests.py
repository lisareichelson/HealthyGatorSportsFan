# tests/test_utils.py
import time
from django.test import TestCase
from unittest.mock import patch, MagicMock
from app.utils import check_game_status, send_notification
import cfbd

class UtilsTestCase(TestCase):
    @patch('app.utils.redis_client')
    @patch('app.utils.cfbd.GamesApi.get_scoreboard')
    def test_check_game_status(self, mock_get_scoreboard, mock_redis_client):
        # Mock different game outcomes
        mock_get_scoreboard.side_effect = [
            [MagicMock(home_team=MagicMock(name='Florida Gators', points=21),
                       away_team=MagicMock(name='Opponent', points=7), status='in_progress')],
            [MagicMock(home_team=MagicMock(name='Florida Gators', points=14),
                       away_team=MagicMock(name='Opponent', points=14), status='in_progress')],
            [MagicMock(home_team=MagicMock(name='Florida Gators', points=10),
                       away_team=MagicMock(name='Opponent', points=24), status='completed')],
        ]

        # Mock Redis client
        mock_redis_client.get.return_value = None

        expected_statuses = ['in_progress', 'in_progress', 'completed']
        expected_game_statuses = ['winning_decisive', 'tied', 'losing_decisive']

        # Call the function and trigger notifications every 5 seconds
        for i in range(len(mock_get_scoreboard.side_effect)):
            game_status = check_game_status(mock_get_scoreboard)
            send_notification(game_status)
            time.sleep(5)  # Wait for 5 seconds before the next iteration
            # Testing only version
            # with patch('app.utils.send_push_notification_next_game') as mock_send_push:
            #     send_notification(game_status)
            #     mock_send_push.assert_called_once()
            # Assert the expected outcome for each iteration
            self.assertEqual(mock_get_scoreboard.side_effect[i][0].status, expected_statuses[i])
            self.assertEqual(game_status, expected_game_statuses[i])


# Run the tests
if __name__ == '__main__':
    import unittest
    unittest.main()