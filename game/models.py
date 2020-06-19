from django.db import models

# Create your models here.


class FigureLink(models.Model):
    master = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    figure = models.ForeignKey('Figure', on_delete=models.CASCADE)  # remake as set of values
    x = models.IntegerField(default=0)
    y = models.IntegerField(default=0)
    landed = models.BooleanField(default=False)

    def __str__(self):
    	return "%s's %s" % (self.master.username, self.figure.name)


class Figure(models.Model):
    name = models.CharField(max_length=30)
    price = models.IntegerField(default=0)

    def __str__(self):
    	return self.name
