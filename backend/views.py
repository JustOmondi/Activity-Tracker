from django.shortcuts import render, get_object_or_404, redirect
from django.views import generic
from django.http import HttpResponseRedirect

class MainView(generic.ListView):
    template_name = 'backend/index.html'
    context_object_name = 'todo_list'