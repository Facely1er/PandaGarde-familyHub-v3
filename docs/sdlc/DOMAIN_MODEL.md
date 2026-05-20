# PandaGarde Domain Model

## Core Entities

### Family
Represents household governance structure.

### Guardian
Authorized parent or caregiver.

### ChildProfile
Age-banded child profile.

### LearningActivity
Educational interaction record.

### PrivacyMilestone
Tracked educational achievement.

### School
Educational organization.

### Vendor
Educational technology provider.

### ScreenTimeSession
Tracked digital wellness session.

### ConsentRecord
Guardian authorization artifact.

### ModerationEvent
Safety review event.

### AIInteraction
AI-assisted interaction log.

## Entity Relationships

```
Family 1──* Guardian
Family 1──* ChildProfile
Family 1──* ConsentRecord
ChildProfile 1──* LearningActivity
ChildProfile 1──* PrivacyMilestone
ChildProfile 1──* ScreenTimeSession
School 1──* Vendor
School *──* Family (optional linkage)
ModerationEvent *──1 ChildProfile | AIInteraction
```

See [../diagrams/domain_model_v1.mmd](../diagrams/domain_model_v1.mmd) for the visual domain model.
