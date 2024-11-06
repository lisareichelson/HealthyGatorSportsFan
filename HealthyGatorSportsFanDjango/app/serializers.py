from rest_framework import serializers
from .models import UserData, User

# Serializes models to JSON for the front end
# Deserializes and validates data from the front end, then saves it to the database

# Best practice is one serializer per model

# this is for the initial test with Postman
#class UserDataSerializer(serializers.ModelSerializer):
    #class Meta:
        #model = UserData # Use 'UserData' model
        #fields = ['user', 'goal_type', 'weight_value', 'feel_better_value', 'timestamp'] 

# Serializer for User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'gender', 'height', 'goal_weight']
        # required fields in models.py, but these are overidden temporarily
        extra_kwargs = {
            'gender': {'required': False, 'default': "Other"},
            'height': {'required': False, 'default': "Unknown"},
            'goal_weight': {'required': False, 'default': 0.0},
        }

    # Only 'email', 'username' and 'password' are required for the createcredentialsscreen.tsx screen
    def create(self, validated_data):
        return User.objects.create(
            email=validated_data['email'],
            password=validated_data['password'],
            birthdate="2000-01-01",
            gender=validated_data.get('gender', "Other"),
            height=validated_data.get('height', "Unknown"),
            goal_weight=validated_data.get('goal_weight', 0.0)
        )
    
    def update(self, instance, validated_data):
        # Update fields when new data comes from the basicinfo.tsx screen
        instance.birthdate = validated_data.get('birthdate', instance.birthdate)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.height = validated_data.get('height', instance.height)
        instance.goal_weight = validated_data.get('goal_weight', instance.goal_weight)
        instance.save()
        return instance
    
# Serializer for UserData
# Serializer for NotificationData