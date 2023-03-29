
from rest_framework import serializers

from .models import Report

class ReportSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Report
        fields = ('type', 'name', 'updated', 'value', 'text_value')