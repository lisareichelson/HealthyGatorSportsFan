from django.shortcuts import render
from .models import User, UserData, NotificationData
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserDataSerializer
from .serializers import UserSerializer
import os
import cfbd
import pytz
from django.http import JsonResponse
from datetime import date, datetime
# Create your views here.

#  for testing with Django's web interface
def index(request):
    # Gets all of the current objects from the database
    user_objs = User.objects.all()
    user_data_objs = UserData.objects.all()
    notification_objs = NotificationData.objects.all()

    # Pass the objects to the Django template (embedded Python in HTML file)
    context = {
        "user_objs": user_objs,
        "user_data_objs": user_data_objs,
        "notification_objs": notification_objs,
    }
    return render(request, "index.html", context)

# 'request' is the entire HTTP object (headers, request method like GET, POST, others), etc...)
# 'request.data' is used to access parsed data like the JSON or form data
# 'request.body' is used to access raw data that is not parsed
# 'self' refers to the current instance

# API view to handle POST requests for data sent from Postman
class WeightView(APIView):
    def post(self, request):

        # Print for debugging
        print("Received Data:", request.data)

        serializer = UserDataSerializer(data=request.data) # Validate the data
        if serializer.is_valid():
            serializer.save() # Save the validated data to the database
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# API view to handle POST requests for data sent from createcredentialsscreen.tsx (username and password)
class CreateUserView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class SendNotificationView(APIView):
#     def post(self, request):
#         serializer = NotificationDataSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     def send_notification(self, data):
#         expo_push_url = "https://exp.host/--/api/v2/push/send"
#         message = {
#             "to": data['user'].google_acct_id,
#             "title": "Score Update",
#             "body": data["Testing to see if this push notification works!"],
#         }
#
def poll_cfbd_view(request):
    configuration = cfbd.Configuration(
        api_key=os.getenv('COLLEGE_FOOTBALL_API_KEY')
    )
    apiInstance = cfbd.GamesApi(cfbd.ApiClient(configuration))

    def get_next_game():
        current_year = date.today().year
        games = apiInstance.get_games(year=current_year, team='Florida', conference='SEC')
        today = datetime.combine(date.today(), datetime.min.time())
        future_games = [game for game in games if game.start_date.replace(tzinfo=None) > today]
        return min(future_games, key=lambda x: x.start_date) if future_games else None

    next_game = get_next_game()
    if next_game:
        user_tz = pytz.timezone('America/New_York')  # TODO: Get user's timezone from database
        game_time = next_game.start_date.astimezone(user_tz)
        response = {
            "teams": f"{next_game.home_team} vs {next_game.away_team}",
            "date": game_time.strftime('%m-%d-%Y %I:%M %p')
        }
    else:
        response = {"message": "No upcoming games found."}

    return JsonResponse(response)
#class GetGameNotificationView(APIView):

