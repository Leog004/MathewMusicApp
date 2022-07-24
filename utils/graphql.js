const {request, gql} = require('graphql-request');

const graphqlAPI = process.env.GRAPHCMSAPITOKEN;

exports.GetAllMusic = async () => {
    

    const query = gql`query GetAllMusic {
        musics(orderBy: releasedDate_DESC) {
          id
          title
          isFeaturedOnHeader
          lyrics
          musicHashTags
          albumImage {
            url
          }
          spotifyUrl
          releasedDate
          showOnWeb
        }
      }
      `;

      const result = await request(graphqlAPI, query); // get our response from api call

      return result.musics; // return data

}

exports.GetFeaturedSong = async () => {

    const query = gql`query GetFeaturedSong {
    musics(first: 1, where: {isFeaturedOnHeader: true}) {
      id
      title
      isFeaturedOnHeader
      lyrics
      musicHashTags
      albumImage {
        url
      }
      spotifyUrl
      releasedDate
      showOnWeb
    }
  }`

  const result = await request(graphqlAPI, query); // get our response from api call

  return result.musics; // return data

}

