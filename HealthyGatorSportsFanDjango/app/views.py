from django.shortcuts import render
from .models import User, UserData, NotificationData
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserDataSerializer
from .serializers import UserSerializer

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
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# API view to handle POST requests for data sent from the front-end (basicinfo.tsx)
class BasicInfoView(APIView):
    def post(self, request, user_id):
        user = User.objects.get(pk=user_id)  # Get the user instance by ID
        serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
