from django.urls import path
from . import views

urlpatterns = [
    path('', views.submit_form, name='submit_form'),
    path('submitted/', views.form_submitted, name='form_submitted'),
]