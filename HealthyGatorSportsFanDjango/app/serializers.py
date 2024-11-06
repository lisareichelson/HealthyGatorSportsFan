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
        fields = ['username', 'password', 'gender', 'height', 'goal_weight']

    # Only 'username' and 'password' are required for the createcredentialsscreen.tsx screen
    def create(self, validated_data):
        return User.objects.create(
            username=validated_data['username'],
            password=validated_data['password'],
            # the following are input on other screens, so a default value is set for now
            birthdate="2000-01-01",
            gender="Other",
            height="Unknown",
            goal_weight=0.0
        )
    
    def update(self, instance, validated_data):
        # Update fields when new data comes from the basicinfo.tsx screen
        instance.gender = validated_data.get('gender', instance.gender)
        instance.height = validated_data.get('height', instance.height)
        instance.goal_weight = validated_data.get('goal_weight', instance.goal_weight)
        instance.save()
        return instance
    
# Serializer for UserData
# Serializer for NotificationData