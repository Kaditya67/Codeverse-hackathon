# Generated by Django 5.1.6 on 2025-03-01 09:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_remove_roadmap_done_topics_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="topic",
            name="roadmap",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="topics",
                to="api.roadmap",
            ),
        ),
    ]
