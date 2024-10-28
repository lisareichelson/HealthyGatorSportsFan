from rest_framework import serializers
from .models import UserData, User

# Serializes models to JSON for the front end
# Deserializes and validates data from the front end, then saves it to the database

# this is for the test with Postman
class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData # Use 'UserData' model
        fields = ['user', 'goal_type', 'weight_value', 'feel_better_value', 'timestamp'] 

# this is for the test with the front end (createcredentialsscreen.tsx)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']

    # Only 'username' and 'password' are required for the createcredentialsscreen.tsx
    def create(self, validated_data):
        return User.objects.create(
            username=validated_data['username'],
            password=validated_data['password'],
            # the following are input on other screens, so a default value is set for now
            birthdate="2000-01-01",
            gender="Other",
            height="Unknown",
            goal_weight=0.0,
            goal_to_lose_weight=False,
            goal_to_feel_better=False,
        )