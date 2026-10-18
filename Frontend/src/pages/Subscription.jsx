import PageContainer from "../components/layout/PageContainer";
import AppHeader from "../components/layout/AppHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Icon from "../components/ui/Icon";

export default function Subscription() {
  return (
    <PageContainer>
      <AppHeader title="Ddiba Plus" backTo="/dashboard" />
      <Card style={{ background: "#ebe9ff", marginTop: 12 }}>
        <Badge>Ddiba Plus Experience</Badge>
        <h1 className="page-title">Unlock your full learning flow <Icon name="sparkle" /></h1>
        <p className="subtitle">Gentle, stress-free mastery with unlimited AI explanations, voice dictation, and multisensory tools.</p>
      </Card>

      <Card style={{ marginTop: 18 }}>
        <Badge>Most Popular • Recommended</Badge>
        <div className="topic-progress-head" style={{ marginTop: 12 }}>
          <h2>Ddiba Plus</h2><h2>$4.99 <small>/month</small></h2>
        </div>
        <p className="muted">Designed for everyday learners desiring calm, adaptive clarity and infinite patience.</p>
        <div className="stack">
          {["Unlimited voice dictation","Unlimited uploads","Custom analogies & pace","Calming audio read-aloud","Spaced repetition decks","Dyslexia fonts & sensory modes"].map(x => <div key={x}><Icon name="check" /> {x}</div>)}
        </div>
        <Button style={{ marginTop: 18 }}>Start 7-Day Free Trial</Button>
      </Card>
    </PageContainer>
  );
}
