import { CancelOutlined, CheckCircleOutlined, HelpOutlined } from "@mui/icons-material"
import { List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { ReactNode } from "react"

interface CriteriaWidgetProps {
  criteria: string[]
  eligibility: EligibilityRule[]
}

export default function CriteriaWidget(props: CriteriaWidgetProps){
  const criteriaDescriptions = []

  const eligibilityIcon: {[key: string]: ReactNode} = {}
  if(props.eligibility){
    props.eligibility.forEach(e => eligibilityIcon[e.id] = e.passed ? <CheckCircleOutlined color="success" /> : <CancelOutlined color="error" />)
  }

  const liWrap = (key: string, text: string) => <ListItem key={key}>
    <ListItemIcon>{eligibilityIcon[key] || <HelpOutlined />}</ListItemIcon>
    <ListItemText>{text}</ListItemText>
  </ListItem>

  if((props.criteria || []).includes("active")){
    criteriaDescriptions.push(liWrap("active", "You must be an active member"))
  }

  if((props.criteria || []).includes("under25")){
    criteriaDescriptions.push(liWrap("under25", "You must be under 25 years old at the time of the event"))
  }else if((props.criteria || []).includes("over25")){
    criteriaDescriptions.push(liWrap("over25", "You must be at least 25 years old at the time of the event"))
  }

  if (criteriaDescriptions.length === 0){
    return null
  }

  return <>
    <Typography variant="body1">The following attendance criteria applies to this event:</Typography>
    <List>
    {criteriaDescriptions}  
    </List>
  </>
}