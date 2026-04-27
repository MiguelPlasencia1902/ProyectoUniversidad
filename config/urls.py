from django.urls import path

from core import views

urlpatterns = [
    # La demo pública expone solo la landing principal.
    path('', views.index, name='home'),
    path('index.html', views.index, name='index'),
]
