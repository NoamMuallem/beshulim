import * as React from "react";
import { Jumbotron } from "react-bootstrap";

export interface WelcomeProps {}

const Welcome: React.SFC<WelcomeProps> = () => {
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
