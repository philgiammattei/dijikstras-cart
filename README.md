# [Dijikstra's Cart](https://dijikstras-cart.netlify.com/)

[Dijkstra's Algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) helps you find the shortest path through a graph.  Dijikstra's Cart is an automagic shopping list to help you chart the most efficient route through your neighborhood grocery store.

View this app in action [here](https://dijikstras-cart.netlify.com/).

## Features

Dijikstra's Cart inputs a series of grocery items from the user (e.g. Broccoli or Pork Chops), and matches each item to a section of the store (e.g. Produce or Meat).  Each item is mapped to its corresponding section as it is entered, and the sections are ordered by their location in the store (Users can re-order sections to match their store's layout).

If the app cannot match an item to a section, the user can manually select its section, and Dijikstra's Cart will remember this mapping for all future sessions.

This app was designed to be accessible and mobile-friendly from the start, so touch targets are large and the layout looks great on any size screen.

## Under the Hood

I wrote Dijikstra's Cart to help familiarize myself with React, a popular front-end library and industry hot topic.  React excels at creating modular views and responding quickly and efficiently to input, so it's the perfect match for an auto-sorting grocery list.

React organizes on Components, which are lightweight, modular and reusable.  The `<App />` component contains the header and `<List />`, which is itself composed of `<Section />` components, which generate `<Item />` and `<Checkbox />` components.

Through callback functions, mouse input trickles up the hierarchy, and the `setState()`  and `render()` functions of parent components pass information from parents to children.  Most of the business logic of the app occurs at the `<List />` level, where arrays of interrelated `item` and `section` objects are manipulated to reflect the user's input.  

Dijikstra's Cart utilizes an [Airtable](https://airtable.com) back-end to create an ever-growing and persistent knowledge base.  On loading, the app calls for 2 database tables as JSON, which are then processed and mapped into the state of the `<List />` component.  Every time a new item-to-section mapping is made by the user, the app makes a call to insert a new record into the table that manages those relationships.  The next time any user adds that item, it will automatically be placed in its proper section.

## Whats Next

The most obvious future feature for this app is the ability for users to save and load their personalized list, and adjust it according to their needs.  Currently every time the app loads, it starts with an empty list, and while the database makes section mapping persistent, I want to utilize it further to make this app truly useful to efficiency-minded shoppers.

I originally developed this app as a replacement for iOS Reminders, which was a very functional grocery list solution until iOS 13, where re-ordering items became a frustrating chore.  Apple has an open Reminders API, so my hope is that one day I can make a native iOS/watchOS app that takes full advantage of the power of iCloud.  Don't even get me started on possible Augmented Reality use cases, that's a discussion for 2021 at the earliest.
