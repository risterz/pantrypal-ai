@startuml PantryPal Use Case Diagram
left to right direction
skinparam packageStyle rectangle

' Define actors
actor "User" as user
actor "Admin" as admin

' Define use cases
rectangle "PantryPal Web Application" {
    ' Authentication use cases
    usecase "Register Account" as UC1
    usecase "Login" as UC2
    usecase "Logout" as UC3
    usecase "Reset Password" as UC4
    
    ' Recipe management use cases
    usecase "Browse Recipes" as UC5
    usecase "Search Recipes" as UC6
    usecase "View Recipe Details" as UC7
    usecase "Save Favorite Recipes" as UC8
    
    ' Profile management use cases
    usecase "View Profile" as UC12
    usecase "Edit Profile" as UC13
    usecase "View Favorites" as UC14
    
    ' Dashboard use cases
    usecase "View Dashboard" as UC15
    usecase "Manage Content" as UC16
    
    ' Admin-only use cases
    usecase "Sync Recipes from API" as UC17
}

' Define the authenticated user on the right side
actor "Authenticated User" as auth_user

' Place actors: User and Admin on left, Authenticated User on right
user -[hidden]-> admin
UC8 -[hidden]-> auth_user

' Define relationships with appropriate arrows
user --> UC1
user --> UC2
user --> UC3
user --> UC4
user --> UC5
user --> UC6
user --> UC7

UC8 <-- auth_user
UC12 <-- auth_user
UC13 <-- auth_user
UC14 <-- auth_user
UC15 <-- auth_user

admin --> UC16
admin --> UC17

' Define extends relationships
UC5 <|-- UC6
UC7 <|-- UC8

' Layout adjustments
skinparam actorStyle awesome
skinparam nodesep 30
skinparam ranksep 30
skinparam defaultFontName Arial
skinparam defaultFontSize 12

@enduml 