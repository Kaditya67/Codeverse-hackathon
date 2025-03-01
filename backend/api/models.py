from django.db import models

class Topic(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Roadmap(models.Model):
    language = models.CharField(max_length=100)
    roadmap_requirements = models.TextField()
    
    topics = models.ManyToManyField(Topic, related_name="roadmaps")
    done_topics = models.ManyToManyField(Topic, related_name="completed_roadmaps", blank=True)
    not_interested_topics = models.ManyToManyField(Topic, related_name="skipped_roadmaps", blank=True)

    def __str__(self):
        return f"{self.language} Roadmap"
