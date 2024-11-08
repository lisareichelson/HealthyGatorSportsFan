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
        fields = ['email', 'password', 'first_name', 'last_name', 'birthdate', 'gender', 'height_feet', 'height_inches', 'goal_weight']
        # required fields in models.py, but these are overidden temporarily
        extra_kwargs = {
            'birthdate': {'required': False, 'default': "2000-01-01"},
            'gender': {'required': False, 'default': "Other"},
            'first_name': {'required': False, 'default': ''},
            'last_name': {'required': False, 'default': ''},
            'height_feet': {'required': False, 'default': 0},
            'height_inches': {'required': False, 'default': 0},
            # DEBUG Remove the default value for goal_weight to prevent unintended overwrites
            'goal_weight': {'required': False},
            #'goal_weight': {'required': False, 'default': 0.0}
        }

    # Only 'email' and 'password' are required for the createcredentialsscreen.tsx screen
    def create(self, validated_data):
        return User.objects.create(
            email=validated_data['email'],
            password=validated_data['password'],
            # These are set to default for this screen
            birthdate="2000-01-01",
            gender=validated_data.get('gender', "Other"),
            height_feet=validated_data.get('height_feet', 0),
            height_inches=validated_data.get('height_inches', 0),
            goal_weight=validated_data.get('goal_weight', 0.0)
        )
    
    def update(self, instance, validated_data):
        # Update fields when new data comes from the basicinfo.tsx screen
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.birthdate = validated_data.get('birthdate', instance.birthdate)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.height_feet = validated_data.get('height_feet', instance.height_feet)
        instance.height_inches = validated_data.get('height_inches', instance.height_inches)
        #instance.goal_weight = validated_data.get('goal_weight', instance.goal_weight)
        #UNDO if this doesn't work!
         # Handling goal_weight properly
        if 'goal_weight' in validated_data:
            instance.goal_weight = float(validated_data['goal_weight'])
        instance.save()
        return instance
    
# Serializer for UserData
class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = ['weight_value']
        extra_kwargs = {
            'weight_value': {'required': False, 'default': 0.0}
        }

    def create(self, validated_data):
        weight_value = validated_data.get('weight_value', 0.0)
        return UserData.objects.create(weight_value=weight_value)

    def update(self, instance, validated_data):
        # Update fields when new data comes from the basicinfo.tsx screen
        instance.weight_value = validated_data.get('weight_value', instance.weight_value)
        instance.save()
        return instance
    
# ToDo
# Serializer for NotificationData