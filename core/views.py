from django.shortcuts import render


def index(request):
    # Renderiza la única vista pública de la presentación.
    return render(request, 'index.html')
