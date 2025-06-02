import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Divider,
  Card,
  CardContent,
  Grid,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import {
  Group as GroupIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2, 3),
    '& .MuiTypography-h6': {
      display: 'flex',
      alignItems: 'center',
      fontWeight: 600,
    },
  },
  dialogContent: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
  },
  summaryCard: {
    marginBottom: theme.spacing(3),
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    color: theme.palette.primary.contrastText,
  },
  summaryItem: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  summaryNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  summaryLabel: {
    fontSize: '0.9rem',
    opacity: 0.9,
  },
  teamSection: {
    marginBottom: theme.spacing(3),
  },
  teamHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
  },
  teamIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  teamName: {
    fontWeight: 600,
    flex: 1,
  },
  teamCount: {
    marginLeft: theme.spacing(1),
  },
  subscriberItem: {
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    '&:hover': {
      boxShadow: theme.shadows[2],
    },
  },
  subscriberAvatar: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  subscriberInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
  subscriberMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: '0.8rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing(2),
    color: theme.palette.text.disabled,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.primary.contrastText,
  },
}));

const ApiSubscriptionDialog = ({ open, onClose, api, subscribers = [] }) => {
  const classes = useStyles();
  const theme = useTheme();

  // 按团队分组订阅者
  const groupedByTeam = subscribers.reduce((groups, subscriber) => {
    const team = subscriber.team || '未分配团队';
    if (!groups[team]) {
      groups[team] = [];
    }
    groups[team].push(subscriber);
    return groups;
  }, {});

  // 获取唯一团队数量
  const uniqueTeams = Object.keys(groupedByTeam);
  const totalSubscribers = subscribers.length;

  // 生成随机头像颜色
  const getAvatarColor = (name) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      '#FF5722',
      '#4CAF50',
      '#FF9800',
      '#9C27B0',
      '#00BCD4',
      '#795548'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // 格式化日期
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle className={classes.dialogTitle}>
        <GroupIcon style={{ marginRight: theme.spacing(1) }} />
        {api?.name} - 订阅情况
        <Button
          className={classes.closeButton}
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        {totalSubscribers > 0 ? (
          <>
            {/* 汇总信息卡片 */}
            <Card className={classes.summaryCard}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <div className={classes.summaryItem}>
                      <Typography className={classes.summaryNumber}>
                        {totalSubscribers}
                      </Typography>
                      <Typography className={classes.summaryLabel}>
                        总订阅数
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div className={classes.summaryItem}>
                      <Typography className={classes.summaryNumber}>
                        {uniqueTeams.length}
                      </Typography>
                      <Typography className={classes.summaryLabel}>
                        订阅团队
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div className={classes.summaryItem}>
                      <Typography className={classes.summaryNumber}>
                        {Math.round(totalSubscribers / uniqueTeams.length * 10) / 10}
                      </Typography>
                      <Typography className={classes.summaryLabel}>
                        平均每团队
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* 按团队分组显示订阅者 */}
            {uniqueTeams.map((teamName) => {
              const teamMembers = groupedByTeam[teamName];
              return (
                <div key={teamName} className={classes.teamSection}>
                  <div className={classes.teamHeader}>
                    <BusinessIcon className={classes.teamIcon} />
                    <Typography variant="h6" className={classes.teamName}>
                      {teamName}
                    </Typography>
                    <Chip
                      label={`${teamMembers.length} 人`}
                      size="small"
                      color="primary"
                      className={classes.teamCount}
                    />
                  </div>

                  <List dense>
                    {teamMembers.map((subscriber, index) => (
                      <ListItem key={index} className={classes.subscriberItem}>
                        <ListItemAvatar>
                          <Avatar
                            className={classes.subscriberAvatar}
                            style={{ backgroundColor: getAvatarColor(subscriber.userId || 'U') }}
                          >
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1" style={{ fontWeight: 500 }}>
                              {subscriber.userName || subscriber.userId || '未知用户'}
                            </Typography>
                          }
                          secondary={
                            <div className={classes.subscriberInfo}>
                              <Typography variant="body2" color="textSecondary">
                                {subscriber.role || '成员'}
                              </Typography>
                              <div className={classes.subscriberMeta}>
                                <ScheduleIcon fontSize="small" />
                                <span>订阅时间: {formatDate(subscriber.subscriptionDate)}</span>
                              </div>
                              {subscriber.email && (
                                <div className={classes.subscriberMeta}>
                                  <EmailIcon fontSize="small" />
                                  <span>{subscriber.email}</span>
                                </div>
                              )}
                            </div>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                  {teamName !== uniqueTeams[uniqueTeams.length - 1] && <Divider style={{ margin: '16px 0' }} />}
                </div>
              );
            })}
          </>
        ) : (
          <div className={classes.emptyState}>
            <GroupIcon className={classes.emptyIcon} />
            <Typography variant="h6" gutterBottom>
              暂无订阅者
            </Typography>
            <Typography variant="body2" color="textSecondary">
              该API目前还没有团队或用户订阅
            </Typography>
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApiSubscriptionDialog; 