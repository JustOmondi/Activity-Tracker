from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response


@api_view(['GET'])
def getIndex(request):
    return Response('Index')


# Create your views here.
def index(request):
    return HttpResponse("Hello, You're at the backend index.")


@api_view(['GET', 'POST'])
def logout_request(request):
    if not request.user.id:
        raise AuthenticationFailed('User not found')

    response = Response()
    response.delete_cookie('jwt')
    response.status = status.HTTP_200_OK

    response.data = {'message': 'Successfully logged out'}

    return response
