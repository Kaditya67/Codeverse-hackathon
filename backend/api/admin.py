from django.contrib import admin
from .models import Topic, Roadmap, SubTopic

# Register your models here.

admin.site.register(Topic)
admin.site.register(Roadmap)
admin.site.register(SubTopic)