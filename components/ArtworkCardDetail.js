import React from 'react';
import useSWR from 'swr';
import Error from 'next/error';
import { Card, Container } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { favoritesAtom } from '@/store';
import { Button } from 'react-bootstrap';
import { addToFavourites, removeFromFavourites } from '@/lib/userData';

export default function ArtWorkCardDetail({ objectID }) {
  const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null);
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(favorites?.includes(objectID));
  }, [favorites, objectID]);

  async function favoritesClicked() {
    if (showAdded) {
      setFavorites(await removeFromFavourites(objectID));
      setShowAdded(false);
    } else {
      setFavorites(await addToFavourites(objectID));
      setShowAdded(true);
    }
  }

  if (error) {
    return <Error statusCode={404} />
  } else {
    if (!data) {
      return null;
    }
    else {
      return (
        <Container>

          <Card style={{ width: '100%' }}>
            {data.primaryImage && <Card.Img variant="top" src={data.primaryImage} />}
            <Card.Body>
              {data.title ? <Card.Title>{data.title}</Card.Title> : <Card.Title>N/A</Card.Title>}
              <Card.Text>
                {data.objectDate ? <p><strong>Date: </strong>{data.objectDate}</p> : <p><strong>Date: </strong>N/A</p>}
                {data.classification ? <p><strong>Classification: </strong>{data.classification}</p> : <p><strong>Classification: </strong>N/A</p>}
                {data.medium ? <p><strong>Medium: </strong>{data.medium}</p> : <p><strong>Medium: </strong>N/A</p>}
                <br />
                <br />
                {data.artistDisplayName ?
                  <span>
                    <p><strong>Artist: </strong> {data.artistDisplayName} &nbsp;
                      {data.artistWikidata_URL != "" && <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer" >wiki</a>}
                    </p>
                  </span>
                  : <p><strong>Artist: </strong> N/A</p>}
                {data.creditLine ? <p><strong>Credit Line: </strong>{data.creditLine}</p> : <p><strong>Credit Line: </strong>N/A</p>}
                {data.dimensions ? <p><strong>Dimensions: </strong>{data.dimensions}</p> : <p><strong>Dimensions: </strong>N/A</p>}

                {/* // Button to add to favorites */}
                {showAdded ? <Button variant="primary" onClick={favoritesClicked}>+ Favourite (added)</Button> : <Button variant="outline-primary" onClick={favoritesClicked}>+ Favourite</Button>}
              </Card.Text>
            </Card.Body>
          </Card>
        </Container>
      );
    }
  }
}