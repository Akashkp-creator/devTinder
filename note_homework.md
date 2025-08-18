-Don't trust req.body
-it's good to "Expiring" the token.
-Always think about corner cases.
-Plan neatly, think logically before writing API or any code.
-Thought process -POST(can be PUT,PATCH also) vs GET
module.save()
module.create() they should be last 2nd line in the try block (ie.write after all the validation, corner case handling.) Last line will be res.send(" ...")
But, In GET always make sure what are all the data we are getting to front End.
similarly In POST always make sure what are all the data we are getting to Back End.
