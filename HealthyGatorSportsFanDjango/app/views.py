from django.shortcuts import render
from .models import User, UserData, NotificationData
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, UserDataSerializer

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

# API view to handle POST requests for data sent from the front-end (createcredentialsscreen.tsx)
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
    
# API view to handle POST requests for data sent from the front-end (basicinfo.tsx)
class BasicInfoView(APIView):
    def post(self, request, user_id):
        # Retrieve the user by ID
        user = User.objects.get(pk=user_id) # pk is primary key
        # Separate weight_value for UserData
        weight_value = request.data.pop('weight_value', None) # return 'None' if no weight available

        # Handle User data update
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
            # Handle UserData creation/update with weight_value
            if weight_value is not None:
                user_data, created = UserData.objects.get_or_create(user=user)
                user_data_serializer = UserDataSerializer(user_data, data={'weight_value': weight_value}, partial=True)
                if user_data_serializer.is_valid():
                    user_data_serializer.save()
                else:
                    print("UserData errors:", user_data_serializer.errors)
                    return Response(user_data_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
            # Bypassing persistent data to ensure currentWeight is set from backend response for debugging    
            # Create response data including user information and weight_value
            response_data = user_serializer.data
            response_data['weight_value'] = weight_value

            # Return the user data with success status
            return Response(user_serializer.data, status=status.HTTP_200_OK)
        
        # Log and return errors if the user data is invalid
        print("User errors:", user_serializer.errors)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# API view to handle POST requests for data sent from the front-end (goalcollection.tsx)   
class GoalCollectionView(APIView):
    def post(self, request, user_id):

        # Extract goal_weight and goal_type DEBUG
        goal_weight = request.data.get('goal_weight', None)
        goal_type = request.data.get('goal_type', None)

        user = User.objects.get(pk=user_id)
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        
        if user_serializer.is_valid():
            user_instance = user_serializer.save()
            # Now handle UserData
            user_data, created = UserData.objects.get_or_create(user=user)
            user_data_serializer = UserDataSerializer(user_data, data=request.data, partial=True)
            if user_data_serializer.is_valid():
                user_data_serializer.save()
                return Response({
                    'user': user_serializer.data,
                    'user_data': user_data_serializer.data
                }, status=status.HTTP_200_OK)
            return Response(user_data_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)










