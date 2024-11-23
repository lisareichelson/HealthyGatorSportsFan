from django.shortcuts import render
from .models import User, UserData, NotificationData
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .serializers import UserSerializer, UserDataSerializer, NotificationSerializer
import os
import cfbd
import pytz
from django.http import JsonResponse
from datetime import date, datetime
from .utils import send_push_notification_next_game
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from rest_framework.decorators import api_view

# Create your views here.

# Best practice is one view per page

# 'request' is the entire HTTP object (headers, request method like GET, POST, others), etc...)
# 'request.data' is used to access parsed data like the JSON or form data
# 'request.body' is used to access raw data that is not parsed
# 'self' refers to the current instance

# API view to handle POST requests for data sent from Postman
#class WeightView(APIView):
    #def post(self, request):

        ## Print for debugging
        #print("Received Data:", request.data)

        #serializer = UserDataSerializer(data=request.data) # Validate the data
        #if serializer.is_valid():
            #serializer.save() # Save the validated data to the database
            #return Response(serializer.data, status=status.HTTP_201_CREATED)
        #return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

# API view to handle POST requests for user creation
class CreateUserView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Prepare the response data including the user_id
            response_data = {'user_id': user.user_id}
            response_data.update(serializer.data)
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# API view to handle POST requests for user data creation
class CreateUserDataView(APIView):
    def post(self, request, user_id):
        # Retrieve the user by ID
        user = User.objects.get(pk=user_id) # pk is primary key
        user_data = UserData.objects.create(user=user)
        # Update user data with new information
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
            user_data_serializer = UserDataSerializer(user_data, data=request.data, partial=True)
            if user_data_serializer.is_valid():
                userData = user_data_serializer.save()
                response_data = {'data_id': userData.data_id}
                response_data.update(user_data_serializer.data)
                return Response(response_data, status=status.HTTP_201_CREATED)
            return Response(user_data_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(user_data_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LatestUserDataView(APIView):
    def get(self, request, user_id):
        print("Ok you made it here")
        try:
            recent_data = UserData.objects.filter(user_id=user_id).order_by('-timestamp').first()
            if recent_data:
                serializer = UserDataSerializer(recent_data)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"message": "No data found for this user."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# API view to handle POST requests for data sent from the front-end (basicinfo.tsx)
class BasicInfoView(APIView):
    def post(self, request, user_id):
        # Retrieve the user by ID
        user = User.objects.get(pk=user_id) # pk is primary key
        # Separate weight_value for UserData
        weight_value = request.data.pop('weight_value', None) # return 'None' if no weight available
        # Update user data with new information
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
            # Handle UserData creation if weight is provided
            if weight_value is not None:
                user_data = UserData.objects.create(user=user)
                user_data_serializer = UserDataSerializer(user_data, data={'weight_value': weight_value}, partial=True)
                if user_data_serializer.is_valid():
                    user_data_serializer.save()
                else:
                    print("UserData errors:", user_data_serializer.errors)
                    return Response(user_data_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            # Return the user data with success status
            return Response(user_serializer.data, status=status.HTTP_200_OK)
        # Log and return errors if the user data is invalid
        print("User errors:", user_serializer.errors)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# API view to handle POST requests for data sent from the front-end (goalcollection.tsx)  
class GoalCollectionView(APIView):
    def post(self, request, user_id):
        user = User.objects.get(pk=user_id)
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
            user_data = UserData.objects.create(user=user)
            user_data_serializer = UserDataSerializer(user_data, data=request.data, partial=True)
            if user_data_serializer.is_valid():
                user_data_serializer.save()
                return Response({
                    'user': user_serializer.data,
                    'user_data': user_data_serializer.data
                }, status=status.HTTP_200_OK)
            return Response(user_data_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserLoginView(APIView):
    def get(self, request):
        email = request.query_params.get('email')
        password = request.query_params.get('password')
        users = User.objects.all()  # Fetch all users from the database
        print("Email & password from query parameters: ", email, " & ", password)
        print("Count of users: ", User.objects.count())
        users = User.objects.all()
        print("Users found: ", {users})
        try:
            # Fetch the user by email
            user = User.objects.get(email=email)
            # Check if the provided password matches
            print("User's password from DB: ", user.password)
            if user.check_password(password):
                # If the password is correct, serialize and return user data
                serializer = UserSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# # Shannon, 11/19/2024: Below is an attempt I made at a more advanced auth method using django's built-in auth. I opted for simplicity for now.
# class UserLoginView(APIView):
#     def get(self, request):
#         email = request.query_params.get('email')
#         password = request.query_params.get('password')
#         # Check if a user with the provided username exists
#         if not User.objects.filter(email=email).exists():
#             # Display an error message if the username does not exist
#             messages.error(request, 'Invalid email')
#             return Response({"error": "Invalid email"}, status=status.HTTP_404_NOT_FOUND)
#         user = authenticate(username=email, password=password)
#         if user is not None:
#             login(request, user) #login() function takes an HttpRequest object and a User object, and saves the user's ID in the session.
#             serializer = UserSerializer(user)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         else:
#             return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
#     def logout_view(request):
#         logout(request)
    
# API view to handle GET requests for all notifications for a userID  
class NotificationList(generics.ListAPIView):
    serializer_class = NotificationSerializer
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return NotificationData.objects.filter(user_id=user_id)  # Adjust based on your model's field
    
class BulkDeleteNotifications(APIView):
    def delete(self, request, user_id):
        print("Entered BulkDeleteNotifications View")  
        try:
            notifications = NotificationData.objects.filter(user_id=user_id)
            deleted_count, _ = notifications.delete()
            if deleted_count > 0:
                return Response({'message': f'Deleted {deleted_count} notifications.'}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({'message': 'No notifications found for this user.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("Errors:", e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
                
# API view to handle CRUD requests for a single notification
class NotificationDetail(APIView):
    def post(self, request):
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, notification_id):
        try:
            notification = NotificationData.objects.get(notification_id=notification_id)
            notification.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except NotificationData.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


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
@csrf_exempt
def poll_cfbd_view(request):
    configuration = cfbd.Configuration(
        host="https://apinext.collegefootballdata.com",
        access_token=os.getenv('COLLEGE_FOOTBALL_API_KEY')
    )
    print("Value of 'COLLEGE_FOOTBALL_API_KEY' environment variable :", os.getenv('COLLEGE_FOOTBALL_API_KEY'))                         
    print("Value of 'EXPO_PUSH_TOKEN' environment variable :", os.getenv('EXPO_PUSH_TOKEN'))                         
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
        message = f"Teams: {next_game.home_team} vs {next_game.away_team}, Date: {game_time.strftime('%m-%d-%Y %I:%M %p')}"
    else:
        response = {"message": "No upcoming games found."}
        message = response["message"]
    push_token = os.getenv('EXPO_PUSH_TOKEN')
    if push_token:
        try:
            send_push_notification_next_game(push_token, message)
        except Exception as e:
            print(f"Error sending push notification: {e}")
    return JsonResponse(response)
#class GetGameNotificationView(APIView):

