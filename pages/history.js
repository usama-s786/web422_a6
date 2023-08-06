import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { useRouter } from "next/router";
import { Container, ListGroup, Button, Card } from "react-bootstrap";
import styles from "@/styles/History.module.css";
import { removeFromHistory } from '@/lib/userData'

export default function History() {
  const router = useRouter();

  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  if (!searchHistory) return null;

  let parsedHistory = [];

  searchHistory.forEach(h => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  function historyClicked(event, index) {
    router.push(`/artwork?${searchHistory[index]}`)
  }

  async function removeHistoryClicked(event, index) {
    event.stopPropagation();
    setSearchHistory(await removeFromHistory(searchHistory[index]));

  }
  return (
    <>
      <Container>
        {parsedHistory.length > 0 ? (
          <>
            <ListGroup>
              {parsedHistory.map((historyItem, index) => (
                <ListGroup.Item onClick={(e) => historyClicked(e, index)} className={styles.historyListItem} key={index}>
                  {Object.keys(historyItem).map((key) => (
                    <>
                      {key}: <strong>{historyItem[key]}</strong>&nbsp;
                    </>
                  ))}
                  <Button
                    className="float-end"
                    variant="danger"
                    size="sm"
                    onClick={(e) => removeHistoryClicked(e, index)}
                  >
                    &times;
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        ) : (
          <Card>
            <Card.Body>
              <h4>Nothing Here</h4>
              <p>Try searching for some artwork</p>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
}