import datetime
import json

import jwt
from auditlog.models import LogEntry
from django.contrib.auth.models import User
from django.http import HttpResponse
from reports.models import Report
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from structure.models import Member


@api_view(['GET'])
def getIndex(request):
    return Response('Index')


# Create your views here.
def index(request):
    return HttpResponse("Hello, You're at the backend index.")


@api_view(['POST'])
def login_request(request):
    username = request.data['username']
    password = request.data['password']

    user = User.objects.filter(username=username).first()

    if user is None:
        raise AuthenticationFailed('User not found')

    if not user.check_password(password):
        raise AuthenticationFailed('Incorrect Password')

    payload = {
        'id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=3),
        'iat': datetime.datetime.utcnow(),
    }

    token = jwt.encode(payload, 'secret', algorithm='HS256')

    return Response({'token': token})


@api_view(['POST'])
def logout_request(request):
    response = Response()
    response.delete_cookie('jwt')
    response.status = status.HTTP_200_OK

    response.data = {'message': 'Successfully logged out'}

    return response
