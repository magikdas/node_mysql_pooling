
#GET
ab -c 50 -n 500 -k -H "Content-Type: application/json" http://localhost:5000/api/v1/teacher/123

#POST
ab -p post_data.txt -T application/json -H "Content-Type: application/json" -c 10 -n 500 http://localhost:5000/api/v1/teacher/

#Lower Concurrancy works better
ab -p post_data.txt -T application/json -H "Content-Type: application/json" -c 4 -n 100 http://localhost:5000/api/v1/teacher/


# https://medium.com/zykrrtech/performance-testing-with-apachebench-e2cef6882285

# https://httpd.apache.org/docs/2.4/programs/ab.html




# post_loc.txt contains the json you want to post
# -p means to POST it
# -H adds an Auth header (could be Basic or Token)
# -T sets the Content-Type
# -c is concurrent clients
# -n is the number of requests to run in the test

# ab -p post_loc.txt -T application/json -H 'Authorization: Token abcd1234' -c 10 -n 2000 http://example.com/api/v1/locations/