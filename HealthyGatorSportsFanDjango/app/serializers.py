from rest_framework import serializers
from .models import UserData

# Serializes models to JSON for the front end
# Deserializes and validates data from the front end, then saves it to the database

class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData # Use 'UserData' model
        fields = ['user', 'goal_type', 'weight_value', 'feel_better_value', 'timestamp'] 