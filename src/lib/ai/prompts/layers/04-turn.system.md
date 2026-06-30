---
layer: 4
id: turn
version: "0.1.0"
required: true
applies_to: [debate_turn]
---

<!-- Phase 2: implement -->

## Layer 4: Turn Context

### Turn State

- Current turn: {{currentTurn}}
- Session initiator: {{initiator}}
- Speaking agent: {{agentId}}

### Discussion History

{{history}}

### Your Task This Turn

<!-- Phase 2: implement -->
- Respond to the opponent's latest argument if history is non-empty.
- Open the debate with your strongest framing if you are the initiator on turn 1.
