import * as React from "react";
import { Jumbotron, Button } from "react-bootstrap";
import classes from "./welcome.module.scss";

export interface WelcomeProps {}

const Welcome: React.SFC<WelcomeProps> = () => {
  const dots = [
    "לשמור את כל המתכונים שלא רוצים לאבד",
    "למצוא בקלות מתכונים לפי נושאים ולפי שמות",
  ];

  return (
    <Jumbotron>
      <h1>בישולים</h1>
      <p>
        בישולים הוא ספר מתכונים דיגיטלי ופרטי שמאפשר שמירה ושיטוף (בעתיד) של
        מתכונים וחיפוש קל נוח ומהיר.
      </p>
      <p>
        ניתן בעצם למצוא כל מתכון שרוצים לפי שם או לפי קטגוריות (הקטגוריות אישיות
        כמו לפי ערכים תזונתיים שחשובים לכם, אנשים שאוהבים אותם, לפי חגים ובעצם
        לפי כל נושא שתבחרו)
      </p>
    </Jumbotron>
  );
};

export default Welcome;
