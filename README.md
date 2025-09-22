get schemachema = SchemaFactory.createForClass(Card);
```text
I’m not sure if we should expect this form generator to cover all requirements and expectations. However, it should not force developers to use it or rely solely on the native Angular forms component.
When we encounter specific requirements that the form generator does not cover, there will be two options:

Update the form generator by creating a merge request to enhance it without breaking existing functionality.
Use the native Angular forms component.
```
