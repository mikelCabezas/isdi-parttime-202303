# Map Playgrounds App


## General description 
This app allow to login (or register if not signed up) for search playgrounds in a map and collaborate/interact with in.

View the elements of each park, the recommended age of elements and if the place it's shaded or sun exposed.

<img src="https://media.giphy.com/media/ildLrpK7sOV9ky6NOf/giphy.gif" width="250"/>

Create issues in elements of park.

If you discover a playground is not in the app, you can create it.


In the register page, the user complete the profile with the ages of their children, for later view quickly if the park is compatible of their children.


In any playground, you can view the elements that are in the park, and view the recomended age for any element. 

---


## Functional description

### Use cases 
- Edit user information
- Edit playground 
- Add photos in playground 
- Add playground
- Explore playgrounds nearby
- Search playgrounds by city
- Search playgrounds with advanced search


### User stories
#### View playgrounds nearby
- View markers around the user directly in map
- View directly playgrounds in a modal box with: name, address, elements with ages, its sun exposed or shaded, and image gallery 
- interact with marker in map for open modal with this playground 
- interact with playground preview in nodal box for open another modal with this playground 

#### Search by city
- Search by: name location
- Go directly to city with results

#### Advanced search
- Search by: name, location, elements with ages, its sun exposed or shaded, accessibility elements 
- Go directly to city with results

#### Create Playground
- If you discover a playground not entered in the app, you can create it. 
- If in 10 meters near has an other park, you cannot add new playground. 


## TECHINAL DESCRIPTION 

### DATA MODELS 

User 
- id (string)
- name (string)
- email (string)
- password (string)
- childs ([Array]<'Numbers'>)
- Suscription (Input<'select'>)
- User comments (string)
- User ratings (string)


### Single Playground 
- id (string)
- address (string)
- coordenades (Object of Objects) {
    - latitude (number)
    - longitude (number)
}
- images ([Array]<'strings'>)
- elements (Array of Objects) Array > Object > two properties {
    - element: string ('playground'/'swings')
    - age: number (recommended age)
}
- Sun exposition (string/boolean) {
    - select > two options: sun exposed, shaded
}
- Go to button (string)

### Planning in Notion:
https://www.notion.so/mikelcabezas/58313fd4e62b4b32a73311a4a4524fdb?v=4e7228f7baae4d278ca0787a9b51a382&pvs=4