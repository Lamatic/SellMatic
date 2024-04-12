### Docker build

```
docker build --tag lamatic-image-rag --file Dockerfile .
```

### Docker run

```
docker run -dit --name lamatic-image-rag -p 8000:8000 lamatic-image-rag
```


### CURL to make a post request

> Note: Replace space character with `%20`

```shell
curl -X 'POST' \
  'http://0.0.0.0:8000/embed_text?text=geta%20table%20with%20a%20lamp' \
  -H 'accept: application/json' \
  -d ''
```

