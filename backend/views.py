from django.http import HttpResponse

from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def getIndex(request):
    return Response('Index')

# Create your views here.
def index(request):
    return HttpResponse("Hello, You're at the backend index.")

