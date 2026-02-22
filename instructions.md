# React Native: 0.79

## Environment 

- Default Port: 8000

## Application Demo:
![](https://hrcdn.net/s3_pub/istreet-assets/sYY4bQLGJgyRz49z2nzKng/restaurant-listing-api.gif)

## Functionality Requirements
Complete the implementation of the app according to the following requirements:

- To access the list of restaurants, perform an HTTP GET request using the inbuilt fetch library to https://jsonmock.hackerrank.com/api/food_outlets
- The response to such a request is a JSON with the following 5 fields:
  - page: The current page of the results.
  - per_page: The maximum number of records returned per page.
  - total: The total number of records in the database.
  - total_pages: The total number of pages with results.
  - data: Either an empty array or an array of restaurants objects. Each object has the following schema:
    - city: city we queried for where the outlet is located [STRING]
    - name: name of the outlet [STRING]
    - estimated_cost: estimated cost for 2 persons [INTEGER]
    - user_rating:
      - average_rating: average rating of the outlet [FLOAT]
      - votes: total votes for the outlet [INTEGER]
    - id: unique identifier of the outlet [INTEGER]

- When the data is loading, the ActivityIndicator component should be rendered.
- When is data is successfully loaded, the indicator should be removed, and the Header and Listing components must be displayed.
- The Header component should display the total restaurants in the format `<Count> Restaurants Near You` where the count is the total count of restaurants displayed in the list below.
- The Listing component takes an array of restaurants as a prop. Each element of this array denotes a single restaurant and is in the shape mentioned above.
- Each restaurant is rendered by the LisitingItem component which takes an individual Restaurant as a prop.
- In the Listing component, use the FlatList component of React Native to render a list of Restaurants. Each restaurant in the array must be rendered as a ListingItem component.
- Complete the LisitingItem component by providing the name, city, average rating, and votes count of each restaurant.
- You can assume that the API will always respond with at least one restaurant.

## Testing Requirements
- The ActivityIndicator must have testID="progress"
- Each restaurant item must have testID="restaurant-item"
- Each restaurant's name must be rendered as a <Text> element with testID="name".
- Each restaurant's city name must be rendered as a <Text> element with testID="city".
- Each restaurant's average rating must be rendered as a <Text> element with testID="average-rating".
- Each restaurant's votes count must be rendered as a <Text> element with testID="votes-count".

## Project Specifications

**Read Only Files**
- `__tests__/*`

**Commands**
- run: 
```bash
npm start
```
- install: 
```bash
npm install
```
- test: 
```bash
npm test
```
