from django.db import models

class Roadmap(models.Model):
    language = models.CharField(max_length=100)
    roadmap_requirements = models.TextField()

    def __str__(self):
        return f"{self.language} Roadmap"

class Topic(models.Model):
    name = models.CharField(max_length=255, unique=True)  # Topic Name (e.g., "Python Basics")
    total_topics = models.IntegerField(default=0)
    completed_topics = models.IntegerField(default=0)
    roadmap = models.ForeignKey(Roadmap, on_delete=models.CASCADE, related_name="topics", null=True, blank=True)  

    def __str__(self):
        return self.name

class SubTopic(models.Model):
    STATUS_CHOICES = [
        ("not_done", "Not Done"),
        ("interested", "Interested"),
        ("not_interested", "Not Interested"),
    ]

    name = models.CharField(max_length=255)  # SubTopic Name (e.g., "Variables and Data Types")
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="subtopics")  # Connects SubTopic to Topic
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="not_done")  # Status field

    def __str__(self):
        return f"{self.name} - {self.status} ({self.topic.name})"

class Notes(models.Model):
    notes = models.CharField(max_length=1000)
    subtopic = models.ForeignKey(SubTopic, on_delete=models.CASCADE, related_name="notes")
