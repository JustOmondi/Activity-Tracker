
from rest_framework import serializers

from .models import Report

class ReportSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Report
        fields = ('name', 'updated', 'value')