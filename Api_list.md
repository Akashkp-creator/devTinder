# DevTinder

## authRouter

-POST /signup
-POST /login
-POST /logout

## profileRouter

-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password ==>API for forgot password.

## connectionRequestRouter

            -POST /request/send/:status/:userId

<!--    -POST /request/send/interested/:userId
        -POST /request/send/ignored/:userId         -->

            -POST /request/review/:status/:requestId

<!--        -POST /request/review/accepted/:requestId
            -POST /request/review/rejected/:requestId   -->

## userRouter

-GET /user/requests/received ==> to get all the pending(ie.status:"interested")connection request for the loggedIn user.

-GET /user/connections ===>these are "accepted" connections

-GET /user/feed
