from django.contrib import admin
from django.urls import path
from .views import home, upload_file

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('upload', upload_file, name='upload_file'),
]
