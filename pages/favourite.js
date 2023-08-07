import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { favouritesAtom } from '@/store';
import ArtWorkCard from '../components/ArtworkCard';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';

export default function Favourite() {
  const [favourites, setFavourites] = useAtom(favouritesAtom);
  let [artWorkList, setArtWorkList] = useState([]);

  useEffect(() => {
    setArtWorkList(favourites);
  }, []);

  if (!favourites) return null;

  return (
    <>
      <Container>
        {favourites?.length > 0 ? (
          <>
            <Row className="gy-4">
              {favourites.map((currentObjectID) => (
                <Col lg={3} key={currentObjectID}>
                  <ArtWorkCard objectID={currentObjectID} />
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <Card>
            <Card.Body>
              <h4>Nothing Here</h4>
              <p>Try adding some new artwork to the list.</p>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
}