from django.urls import path

from core import views

urlpatterns = [
    path("", views.index, name="home"),
    path("index.html", views.index, name="index"),
]
