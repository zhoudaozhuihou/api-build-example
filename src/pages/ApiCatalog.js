import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  makeStyles, 
  Paper, 
  Typography, 
  Container, 
  Grid,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Card,
  CardContent,
  Tooltip,
  InputBase,
  useTheme,
  useMediaQuery,
  Badge,
  Fade,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
  Backdrop,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  LinearProgress,
  Switch
} from '@material-ui/core';
import { Pagination, TreeView, TreeItem } from '@material-ui/lab';
import { 
  Search as SearchIcon, 
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  GetApp as GetAppIcon,
  MoreVert as MoreVertIcon,
  AccountTree as AccountTreeIcon,
  FilterList as FilterListIcon,
  Category as CategoryIcon,
  Http as HttpIcon,
  Description as DescriptionIcon,
  Public as PublicIcon,
  Security as SecurityIcon,
  VpnLock as VpnLockIcon,
  Clear as ClearIcon,
  Launch as LaunchIcon,
  PeopleAlt as PeopleAltIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Code as CodeIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIconCollapse,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  Tune as TuneIcon,
  Timeline as TimelineIcon,
  Timeline as LineageIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  Person as PersonIcon,
  CategoryOutlined as CategoryOutlinedIcon,
  Label as LabelIcon,
  Group as TeamIcon
} from '@material-ui/icons';
import ApiTotalStats from '../components/ApiTotalStats';
import ApiFilter from '../components/ApiFilter';
import { apiCategories } from '../constants/apiCategories';
import ApiLineage from '../components/ApiLineage';
import ApiImportDialog from '../components/ApiImportDialog';
import ApiDetailDialog from '../components/ApiDetailDialog';
import ApiCategoryList from '../components/ApiCategoryList';
import ApiSubscriptionDialog from '../components/ApiSubscriptionDialog';

// 背景图URL，您可以替换为自己的图片
const headerBgImage = 'https://source.unsplash.com/random/1600x400/?api,technology,digital';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: '100vh',
  },
  headerSection: {
    height: 380,
    backgroundImage: `linear-gradient(rgba(25, 118, 210, 0.8), rgba(0, 0, 0, 0.8)), url(${headerBgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.common.white,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(5),
    borderRadius: 0,
    position: 'relative',
    overflow: 'hidden',
    margin: '0 auto',
    boxShadow: theme.shadows[10],
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
  },
  headerContent: {
    textAlign: 'center',
    maxWidth: 800,
    zIndex: 2,
    animation: '$fadeIn 1s ease-out',
  },
  bannerTitle: {
    marginBottom: theme.spacing(3),
    fontWeight: 800,
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0,0,0,0.4)',
    letterSpacing: '1px',
    position: 'relative',
    display: 'inline-block',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -8,
      left: '30%',
      width: '40%',
      height: 4,
      backgroundColor: theme.palette.secondary.main,
      borderRadius: 2,
    },
  },
  headerSubtitle: {
    marginBottom: theme.spacing(5),
    fontWeight: 300,
    textAlign: 'center',
    opacity: 0.9,
    maxWidth: 800,
    lineHeight: 1.5,
  },
  searchContainer: {
    position: 'relative',
    borderRadius: '50px',
    backgroundColor: theme.palette.common.white,
    width: '100%',
    maxWidth: 650,
    display: 'flex',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    margin: '0 auto',
    '&:hover': {
      boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
      transform: 'translateY(-2px)',
    },
    animation: '$slideUp 0.7s ease-out 0.3s both',
  },
  searchIcon: {
    padding: theme.spacing(0, 3),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.main,
  },
  searchInput: {
    padding: theme.spacing(1.8, 1, 1.8, 0),
    paddingLeft: `calc(1em + ${theme.spacing(6)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    color: theme.palette.text.primary,
    fontSize: '1.1rem',
    '&::placeholder': {
      opacity: 0.7,
      fontStyle: 'italic',
    },
  },
  inputRoot: {
    width: '100%',
    color: theme.palette.text.primary,
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes slideUp': {
    from: {
      opacity: 0,
      transform: 'translateY(40px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  contentSection: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  leftPanel: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.05)',
    height: 'fit-content',
    minWidth: '280px',
    position: 'sticky',
    top: theme.spacing(3),
    maxHeight: 'calc(100vh - 200px)',
  },
  rightPanel: {
    width: '100%',
    paddingBottom: theme.spacing(4),
    minHeight: 'calc(100vh - 100px)', // 设置最小高
  },
  nestedItem: {
    paddingLeft: theme.spacing(4),
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  doubleNestedItem: {
    paddingLeft: theme.spacing(7),
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  categoryItemPrimary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    borderLeft: '3px solid transparent',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
    },
  },
  selectedItemPrimary: {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.12)',
    },
  },
  categoryCountPrimary: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '12px',
    padding: theme.spacing(0.1, 0.8),
    marginLeft: theme.spacing(1),
    minWidth: '22px',
    height: '20px',
    textAlign: 'center',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  apiCard: {
    height: '320px', // 统一高度
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    borderRadius: theme.shape.borderRadius * 1.5,
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.08)',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    [theme.breakpoints.down('xs')]: {
      height: '300px', // 小屏幕下略微减小高度
    },
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      '& $apiCardTopBar': {
        height: '8px',
      },
    },
  },
  apiCardTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transition: 'height 0.3s ease',
  },
  apiCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing(3, 3, 1),
    backgroundColor: theme.palette.background.paper,
    height: '100px', // 固定头部高度
  },
  apiIcon: {
    marginRight: theme.spacing(1.5),
    color: theme.palette.primary.main,
    fontSize: '2rem',
    background: 'rgba(25, 118, 210, 0.1)',
    padding: theme.spacing(1),
    borderRadius: '50%',
  },
  apiTitle: {
    fontWeight: 600,
    color: theme.palette.text.primary,
    fontSize: '1.1rem',
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  apiDescription: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(0, 0),
    lineHeight: 1.6,
    height: '3.2em', // 固定高度，相当于2行文本
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  apiCardContent: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  apiEndpointsContainer: {
    padding: theme.spacing(0, 2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
    maxHeight: '70px',
    overflow: 'hidden',
    '&:hover': {
      maxHeight: '90px',
      overflow: 'auto',
    },
  },
  apiEndpointLabel: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
    '& svg': {
      fontSize: '1rem',
      marginRight: theme.spacing(0.5),
      color: theme.palette.text.secondary,
    },
    '& .MuiTypography-root': {
      fontSize: '0.75rem',
      fontWeight: 500,
      color: theme.palette.text.secondary,
    },
  },
  apiEndpointChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
  },
  endpointChip: {
    height: '20px',
    fontSize: '0.675rem',
    borderRadius: theme.shape.borderRadius,
    '& .MuiChip-label': {
      padding: theme.spacing(0, 0.8),
      fontFamily: 'monospace',
    },
  },
  methodsContainer: {
    display: 'flex', 
    gap: '4px', 
    flexWrap: 'wrap', 
    justifyContent: 'flex-end',
  },
  apiChip: {
    margin: theme.spacing(0.5),
    borderRadius: '50px',
    fontFamily: 'monospace',
    fontWeight: 500,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    '& .MuiChip-icon': {
      color: theme.palette.primary.main,
    },
  },
  apiStats: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1.5, 3),
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  apiStatText: {
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      fontSize: '1rem',
      marginRight: theme.spacing(0.5),
      opacity: 0.7,
    },
  },
  listTitle: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  expandIcon: {
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandIconOpen: {
    transform: 'rotate(180deg)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(8),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px dashed ${theme.palette.divider}`,
  },
  emptyStateIcon: {
    fontSize: 80,
    marginBottom: theme.spacing(2),
    color: theme.palette.text.disabled,
    opacity: 0.5,
  },
  emptyStateText: {
    maxWidth: 400,
    margin: '0 auto',
  },
  filterSection: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
  },
  filterCategoryRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: theme.spacing(1.5, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  filterCategoryLabel: {
    minWidth: '100px',
    fontWeight: 500,
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
  },
  filterCategoryOptions: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
  },
  filterCategoryChip: {
    margin: theme.spacing(0.5),
    borderRadius: '16px',
    '&.MuiChip-clickable:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
    },
  },
  filterCategoryChipSelected: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&.MuiChip-clickable:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  filterCategoryCount: {
    fontSize: '0.75rem',
    marginLeft: theme.spacing(0.5),
    color: theme.palette.text.disabled,
  },
  filterTitle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  filterIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  filterGroup: {
    marginBottom: theme.spacing(2),
  },
  filterLabel: {
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  filterFormControl: {
    minWidth: 120,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  filterChip: {
    margin: theme.spacing(0.5),
  },
  filterActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(1),
  },
  dateFilter: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  dateField: {
    marginRight: theme.spacing(2),
    width: 150,
  },
  filterAccordion: {
    marginBottom: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 1.5,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    '&::before': {
      display: 'none',
    },
    border: '1px solid rgba(0,0,0,0.05)',
  },
  filterAccordionSummary: {
    backgroundColor: theme.palette.background.default,
    borderTopLeftRadius: theme.shape.borderRadius * 1.5,
    borderTopRightRadius: theme.shape.borderRadius * 1.5,
    '&.Mui-expanded': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
  activeFiltersSection: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  activeFilterLabel: {
    marginRight: theme.spacing(1),
    fontWeight: 500,
    color: theme.palette.text.secondary,
  },
  categoryListContainer: {
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(0, 0.5),
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: theme.palette.background.default,
      borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.primary.light,
      borderRadius: 20,
      border: `2px solid transparent`,
      backgroundClip: 'padding-box',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    flexGrow: 1,
  },
  categoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0.75, 2),
    borderRadius: 0,
    borderLeft: '3px solid transparent',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
      borderLeftColor: theme.palette.primary.light,
    },
  },
  categoryTextPrimary: {
    fontSize: '0.95rem',
    fontWeight: 500,
  },
  categoryCount: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '12px',
    padding: theme.spacing(0.1, 0.8),
    marginLeft: theme.spacing(1),
    minWidth: '22px',
    height: '20px',
    textAlign: 'center',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryActions: {
    display: 'flex',
  },
  actionButton: {
    padding: 4,
    marginLeft: 2,
  },
  addCategoryButton: {
    margin: theme.spacing(1),
  },
  dialogForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    minWidth: 300,
  },
  paginationContainer: {
    padding: theme.spacing(4, 0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paginationInfo: {
    marginBottom: theme.spacing(1.5),
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: theme.spacing(0.5, 2),
    borderRadius: 20,
  },
  apiGridContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  apiGridItem: {
    display: 'flex',
    height: '100%',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(2),
    },
  },
  stickyListHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2, 2.5),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerTitleText: {
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: theme.spacing(1),
    },
  },
  editModeSwitch: {
    marginLeft: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: theme.spacing(0.5, 1.5),
  },
  editModeLabel: {
    fontSize: '0.8rem',
    marginRight: theme.spacing(1),
    fontWeight: 500,
  },
  importButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  importButton: {
    borderRadius: theme.shape.borderRadius,
    textTransform: 'none',
    fontWeight: 500,
    padding: theme.spacing(1, 3),
  },
  lineageIcon: {
    color: theme.palette.secondary.main,
    marginLeft: theme.spacing(1),
    fontSize: '0.8rem',
  },
  apiListItemContent: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  apiListItemAction: {
    opacity: 0.3,
    '&:hover': {
      opacity: 1,
    },
  },
  selectedItem: {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    borderLeft: `3px solid ${theme.palette.primary.main}`,
  },
  lineageChip: {
    marginLeft: theme.spacing(1),
  },
  apiCardFooter: {
    marginTop: 'auto', // 将footer推到底部
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: 'rgba(0,0,0,0.02)',
    minHeight: '50px', // 固定底部高度
  },
  apiCardCategories: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    maxWidth: '70%', // 限制分类标签的宽度
    overflow: 'hidden',
  },
  apiCardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  apiCardAction: {
    padding: 4,
  },
  categoryChip: {
    fontSize: '0.7rem',
    borderRadius: '4px',
    backgroundColor: 'rgba(0,0,0,0.04)',
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    margin: theme.spacing(0.5, 0.5, 0, 0),
  },
  methodChip: {
    borderRadius: '12px',
    height: '24px',
    fontWeight: 600,
    textTransform: 'uppercase',
    fontSize: '0.75rem',
    alignSelf: 'flex-start',
    minWidth: '60px',
    textAlign: 'center',
  },
  apiCardDetailItem: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
    whiteSpace: 'nowrap', // 防止文本换行
    '& svg': {
      fontSize: '1rem',
      marginRight: theme.spacing(0.5),
      color: theme.palette.text.secondary,
    },
    '& .MuiTypography-root': {
      fontSize: '0.8rem',
      color: theme.palette.text.secondary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '120px', // 限制文本宽度
    }
  },
  apiCardDetails: {
    display: 'flex',
    flexWrap: 'nowrap', // 防止换行
    padding: theme.spacing(1, 3),
    marginBottom: theme.spacing(1),
    height: '40px', // 固定详情区域高度
    overflow: 'hidden', // 隐藏溢出内容
  },
  categoryTreeContainer: {
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[1],
    borderRadius: theme.shape.borderRadius,
    maxHeight: 'calc(100vh - 64px - 48px - 16px)',
    overflow: 'auto',
  },
  categoryListHeader: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  categoryListTitle: {
    fontSize: '1rem',
    fontWeight: 600,
  },
  categoryTree: {
    padding: 0,
  },
  addCategoryItem: {
    color: theme.palette.primary.main,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderTop: `1px dashed ${theme.palette.divider}`,
  },
  dataFormatButton: {
    margin: theme.spacing(0.5),
    borderRadius: '20px',
    textTransform: 'uppercase',
    fontSize: '0.7rem',
    fontWeight: 500,
    padding: theme.spacing(0.5, 1.5),
    minWidth: '60px',
  },
  dataFormatContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  apiDetailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  apiDetailTitle: {
    fontWeight: 600,
  },
  apiDetailMetadata: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.secondary,
    '& svg': {
      fontSize: '1rem',
      marginRight: theme.spacing(0.5),
    },
    '& span': {
      marginRight: theme.spacing(2),
      fontSize: '0.85rem',
    },
  },
  apiDetailsPaper: {
    padding: theme.spacing(3),
  },
  dataFormatButtonsCard: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  importButtonHeader: {
    marginTop: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    textTransform: 'none',
    fontWeight: 500,
    padding: theme.spacing(1, 3),
    boxShadow: theme.shadows[3],
    alignSelf: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: theme.shadows[5],
      transform: 'translateY(-2px)',
    },
  },
  // 添加TreeView相关样式
  categoryTreeView: {
    padding: theme.spacing(1),
    width: '100%',
    overflowX: 'hidden',
    '& .MuiTreeItem-root': {
      marginBottom: theme.spacing(0.5),
    },
    '& .MuiTreeItem-content': {
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(0.5, 0),
      transition: 'all 0.2s',
    },
  },
  treeItem: {
    '&:hover > .MuiTreeItem-content': {
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
    },
    '& .MuiTreeItem-label': {
      fontSize: '0.95rem',
      padding: theme.spacing(0.7, 1),
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      borderRadius: theme.shape.borderRadius,
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '& span': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
    '& .MuiTreeItem-iconContainer': {
      marginRight: theme.spacing(1),
      width: '24px',
      display: 'flex',
      justifyContent: 'center',
    },
  },
  treeItemSelected: {
    '& > .MuiTreeItem-content': {
      backgroundColor: 'rgba(25, 118, 210, 0.08) !important',
    },
    '& .MuiTreeItem-label': {
      fontWeight: 500,
      color: theme.palette.primary.main,
    },
  },
  categoryCountTree: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '12px',
    padding: theme.spacing(0.1, 0.8),
    marginLeft: theme.spacing(1),
    minWidth: '22px',
    height: '20px',
    textAlign: 'center',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryActionsContainer: {
    display: 'flex',
    marginLeft: 'auto',
  },
  apiTreeItem: {
    marginLeft: theme.spacing(1.5),
    '& > .MuiTreeItem-content': {
      padding: theme.spacing(0.3, 0),
      '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.04)',
      },
    },
    '& .MuiTreeItem-label': {
      fontSize: '0.85rem',
      color: theme.palette.text.secondary,
      '& span': {
        maxWidth: '180px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'inline-block',
      },
    },
  },
  // 增强API卡片标签区域的样
  apiCardTagsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(0, 3),
    maxHeight: '85px',
    overflow: 'hidden',
  },
  apiTagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    alignItems: 'center',
  },
  apiTagLabel: {
    fontSize: '0.675rem',
    color: theme.palette.text.secondary,
    fontWeight: 500,
    minWidth: '60px',
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      fontSize: '0.9rem',
      marginRight: theme.spacing(0.5),
    },
  },
  apiSmallChip: {
    height: '20px',
    fontSize: '0.675rem',
    margin: theme.spacing(0.25),
    maxWidth: '120px',
    '& .MuiChip-label': {
      padding: theme.spacing(0, 0.8),
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
  noSubscribersIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0.5),
    borderRadius: '50%',
    backgroundColor: theme.palette.background.default,
    border: `1px dashed ${theme.palette.divider}`,
    width: '24px',
    height: '24px',
  },
  subscribersIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0.5),
    borderRadius: '50%',
    backgroundColor: theme.palette.action.selected,
    border: `1px solid ${theme.palette.divider}`,
    width: '24px',
    height: '24px',
  },
  addRootCategoryButton: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  rightPanelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  rightPanelTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
  },
  rightPanelStats: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  rightPanelStatChip: {
    fontSize: '0.8rem',
    fontWeight: 500,
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
  },
}));

// 模拟API数据
let mockApis = [
  {
    id: 'api1',
    name: '用户认证API',
    description: '提供用户登录、注册和认证功能的API',
    category: '用户相关',
    subCategory: '用户认证',
    endpoints: ['/auth/login', '/auth/register', '/auth/verify'],
    method: 'POST',
    responseTime: '120ms',
    popularity: 4.8,
    lastUpdated: '2023-05-15',
  },
  {
    id: 'api2',
    name: '用户资料API',
    description: '获取和更新用户资料信息',
    category: '用户相关',
    subCategory: '用户信息',
    endpoints: ['/users/profile', '/users/update', '/users/avatar'],
    method: 'GET/PUT',
    responseTime: '85ms',
    popularity: 4.5,
    lastUpdated: '2023-06-10',
  },
  {
    id: 'api3',
    name: '订单管理API',
    description: '创建、查询和管理订单的API',
    category: '订单相关',
    subCategory: '订单管理',
    endpoints: ['/orders/create', '/orders/get', '/orders/cancel'],
    method: 'POST/GET',
    responseTime: '150ms',
    popularity: 4.3,
    lastUpdated: '2023-04-28',
  },
  {
    id: 'api-4',
    name: '支付处理API',
    description: '处理支付、退款和交易记录',
    category: '订单相关',
    subCategory: '支付管理',
    endpoints: ['/payments/process', '/payments/refund', '/payments/records'],
    method: 'POST',
    responseTime: '200ms',
    popularity: 4.7,
    lastUpdated: '2023-07-02',
  },
  {
    id: 'api-5',
    name: '产品目录API',
    description: '获取产品列表、详情和分类信息',
    category: '产品相关',
    subCategory: '产品列表',
    endpoints: ['/products/list', '/products/detail', '/products/categories'],
    method: 'GET',
    responseTime: '95ms',
    popularity: 4.4,
    lastUpdated: '2023-06-22',
  },
];

// 提取所有可用的API方法
const allApiMethods = [...new Set(mockApis.flatMap(api => api.method.split('/')))];

// 响应时间范围
const responseTimeRanges = [
  { label: '全部', value: 'all' },
  { label: '极快 (< 50ms)', value: 'very-fast', max: 50 },
  { label: '快(50-100ms)', value: 'fast', min: 50, max: 100 },
  { label: '中等 (100-150ms)', value: 'medium', min: 100, max: 150 },
  { label: '慢(> 150ms)', value: 'slow', min: 150 }
];

const ApiCatalog = () => {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedApi, setSelectedApi] = useState(null);
  const [filteredApis, setFilteredApis] = useState(mockApis);
  const [categories, setCategories] = useState(apiCategories);
  
  // 分页相关状态
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10); // 固定为每页10条
  
  // 新增分类筛选状态
  const [accessLevelFilter, setAccessLevelFilter] = useState(null);
  const [dataFieldFilters, setDataFieldFilters] = useState([]);
  const [themeFilters, setThemeFilters] = useState([]);
  const [serviceFilters, setServiceFilters] = useState([]);
  const [industryFilters, setIndustryFilters] = useState([]);
  const [expandedFilterSections, setExpandedFilterSections] = useState({
    dataField: false,
    theme: false,
    industry: false
  });
  
  // 处理开放等级筛选变化
  const handleAccessLevelFilterChange = (level) => {
    setAccessLevelFilter(accessLevelFilter === level ? null : level);
  };
  
  // 处理分类筛选变化
  const handleFilterChange = (filter, filterType) => {
    let currentFilters;
    let setFilters;
    
    switch(filterType) {
      case 'dataField':
        currentFilters = dataFieldFilters;
        setFilters = setDataFieldFilters;
        break;
      case 'theme':
        currentFilters = themeFilters;
        setFilters = setThemeFilters;
        break;
      case 'service':
        currentFilters = serviceFilters;
        setFilters = setServiceFilters;
        break;
      case 'industry':
        currentFilters = industryFilters;
        setFilters = setIndustryFilters;
        break;
      default:
        return;
    }
    
    if (currentFilters.includes(filter)) {
      setFilters(currentFilters.filter(f => f !== filter));
    } else {
      setFilters([...currentFilters, filter]);
    }
  };
  
  // 处理方法筛选变化
  const handleMethodFilterChange = (method) => {
    setMethodFilters(prev => ({ ...prev, [method]: !prev[method] }));
  };
  
  // 处理清除所有筛选器
  const handleClearAllFilters = () => {
    setAccessLevelFilter(null);
    setDataFieldFilters([]);
    setThemeFilters([]);
    setServiceFilters([]);
    setIndustryFilters([]);
    setMethodFilters({});
    setResponseTimeFilter('all');
    setStartDate('');
    setEndDate('');
  };
  
  // 切换筛选部分展开状态
  const toggleFilterSection = (section) => {
    setExpandedFilterSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // 从localStorage加载自定义API
  useEffect(() => {
    try {
      const savedApis = JSON.parse(localStorage.getItem('apis') || '[]');
      if (savedApis && savedApis.length > 0) {
        // 合并已有的mock API和从localStorage加载的API
        const combinedApis = [...mockApis];
        
        // 添加localStorage中的API
        savedApis.forEach(api => {
          // 避免重复添加
          if (!combinedApis.some(existingApi => existingApi.id === api.id)) {
            combinedApis.push({
              ...api,
              responseTime: api.responseTime || '100ms',
              popularity: api.popularity || 4.0,
              // 如果缺少必要属性，添加默认值
              category: api.categories && api.categories.length > 0 ? api.categories[0].label : '未分类',
              subCategory: api.categories && api.categories.length > 1 ? api.categories[1].label : ''
            });
          }
        });
        
        // 更新API列表
        setFilteredApis(combinedApis);
        // 更新mockApis变量，因为其他过滤器会使用它
        mockApis = [...combinedApis]; // 使用展开运算符创建新数组
      }
      
      // 初始化示例血缘关系数据（仅用于演示）
      initSampleLineageData();
    } catch (error) {
      console.error('从localStorage加载API失败:', error);
      // 确保即使加载失败，也能显示默认数据
      setFilteredApis([...mockApis]);
    }
  }, []);
  
  // 初始化示例血缘关系数据
  const initSampleLineageData = () => {
    try {
      // 为所有示例API添加血缘关系数据
      mockApis.forEach((api, index) => {
        // 检查是否已存在血缘数据
        const existingLineage = localStorage.getItem(`apiLineage_${api.id}`);
        
        // 如果没有现有血缘数据，则添加示例数据
        if (!existingLineage) {
          // 为不同API创建不同的血缘关系，形成一个连接的网络
          let sampleLineageData = {};
          
          switch(index % 5) {
            case 0: // 第一种模式 复杂依赖关系
              sampleLineageData = {
                upstream: [
                  { id: 1, name: '用户认证服务', description: '提供用户登录和验证功能' },
                  { id: 2, name: '配置中心', description: '系统配置信息管理' },
                  { id: 3, name: '日志服务', description: '系统日志收集与存储' },
                  { id: 4, name: '数据仓库', description: '企业数据仓库' }
                ],
                downstream: [
                  { id: 1, name: '订单处理系统', description: '处理用户订单' },
                  { id: 2, name: '支付网关', description: '处理付款流程' },
                  { id: 3, name: '客户管理系统', description: '管理客户信息与关系' },
                  { id: 4, name: '通知服务', description: '发送系统通知和提醒' },
                  { id: 5, name: '分析仪表板', description: '业务数据可视化' }
                ],
                users: [
                  { id: 1, name: '张三', role: '开发工程师', department: '研发部' },
                  { id: 2, name: '李四', role: '产品经理', department: '产品部' },
                  { id: 3, name: '王五', role: '测试工程师', department: '测试部' },
                  { id: 4, name: '赵六', role: '前端开发工程师', department: '研发部' },
                  { id: 5, name: '产品团队', role: '产品经理', department: '产品部' }
                ],
                // 新增字段：上游系统之间的关系
                upstreamRelations: [
                  { source: 1, target: 2, description: '配置依赖' },
                  { source: 1, target: 3, description: '日志记录' },
                  { source: 2, target: 4, description: '数据存储' }
                ],
                // 新增字段：下游系统之间的关系
                downstreamRelations: [
                  { source: 1, target: 2, description: '支付流程' },
                  { source: 1, target: 3, description: '客户信息更新' },
                  { source: 3, target: 4, description: '发送通知' },
                  { source: 3, target: 5, description: '分析数据' }
                ]
              };
              break;
              
            case 1: // 第二种模式 服务网格
              sampleLineageData = {
                upstream: [
                  { id: 1, name: '网关服务', description: 'API网关' },
                  { id: 2, name: '认证服务', description: '身份验证' },
                  { id: 3, name: '用户服务', description: '用户数据管理' }
                ],
                downstream: [
                  { id: 1, name: '商品服务', description: '商品信息管理' },
                  { id: 2, name: '购物车服务', description: '购物车功能' },
                  { id: 3, name: '推荐引擎', description: '智能推荐系统' }
                ],
                users: [
                  { id: 1, name: '移动团队', role: '开发工程师', department: '移动部门' },
                  { id: 2, name: '网站团队', role: '开发工程师', department: '网站部门' }
                ],
                upstreamRelations: [
                  { source: 1, target: 2, description: '认证流量' },
                  { source: 2, target: 3, description: '用户数据' }
                ],
                downstreamRelations: [
                  { source: 1, target: 2, description: '商品加入购物车' },
                  { source: 1, target: 3, description: '获取推荐' }
                ]
              };
              break;
              
            case 2: // 第三种模式 数据
              sampleLineageData = {
                upstream: [
                  { id: 1, name: '数据收集服务', description: '收集用户行为数据' },
                  { id: 2, name: '原始数据存储', description: '存储原始日志' },
                  { id: 3, name: '数据转换服务', description: 'ETL处理' }
                ],
                downstream: [
                  { id: 1, name: '分析服务', description: '数据分析处理' },
                  { id: 2, name: '报表服务', description: '生成业务报表' },
                  { id: 3, name: '机器学习服务', description: '预测模型' },
                  { id: 4, name: 'BI工具', description: '业务智能工具' }
                ],
                users: [
                  { id: 1, name: '数据分析团队', role: '分析工程师', department: '数据部门' },
                  { id: 2, name: '业务团队', role: '业务人员', department: '业务部门' },
                  { id: 3, name: '管理团队', role: '决策者', department: '管理部门' }
                ],
                upstreamRelations: [
                  { source: 1, target: 2, description: '存储数据' },
                  { source: 2, target: 3, description: '转换处理' }
                ],
                downstreamRelations: [
                  { source: 1, target: 2, description: '生成报表' },
                  { source: 1, target: 3, description: '训练模型' },
                  { source: 2, target: 4, description: '可视化展示' }
                ]
              };
              break;
              
            case 3: // 第四种模式 微服务架构
              sampleLineageData = {
                upstream: [
                  { id: 1, name: '服务注册中心', description: '服务发现与注册' },
                  { id: 2, name: '配置服务', description: '集中配置管理' },
                  { id: 3, name: '监控服务', description: '系统监控' }
                ],
                downstream: [
                  { id: 1, name: '订单微服务', description: '订单管理' },
                  { id: 2, name: '库存微服务', description: '库存管理' },
                  { id: 3, name: '支付微服务', description: '支付处理' },
                  { id: 4, name: '物流微服务', description: '物流跟踪' }
                ],
                users: [
                  { id: 1, name: '微服务团队', role: '架构师', department: '架构部门' },
                  { id: 2, name: '运维团队', role: 'DevOps工程师', department: '运维部门' }
                ],
                upstreamRelations: [
                  { source: 1, target: 2, description: '配置发现' },
                  { source: 1, target: 3, description: '服务监控' }
                ],
                downstreamRelations: [
                  { source: 1, target: 2, description: '库存检查' },
                  { source: 1, target: 3, description: '订单支付' },
                  { source: 1, target: 4, description: '发货通知' },
                  { source: 3, target: 4, description: '支付确认' }
                ]
              };
              break;
              
            case 4: // 第五种模式 前端应用
              sampleLineageData = {
                upstream: [
                  { id: 1, name: 'API网关', description: '统一接口入口' },
                  { id: 2, name: '权限管理', description: '用户权限控制' }
                ],
                downstream: [
                  { id: 1, name: '管理后台', description: '系统管理界面' },
                  { id: 2, name: '移动应用', description: '手机客户端' },
                  { id: 3, name: '小程序', description: '微信小程序' },
                  { id: 4, name: 'H5页面', description: '营销活动页面' }
                ],
                users: [
                  { id: 1, name: '前端团队', role: '前端开发工程师', department: '研发部' },
                  { id: 2, name: '设计团队', role: 'UI/UX设计师', department: '设计部' },
                  { id: 3, name: '市场团队', role: '营销人员', department: '市场部' }
                ],
                upstreamRelations: [
                  { source: 1, target: 2, description: '权限校验' }
                ],
                downstreamRelations: [
                  { source: 1, target: 2, description: '功能复用' },
                  { source: 1, target: 3, description: '数据共享' },
                  { source: 1, target: 4, description: '活动展示' }
                ]
              };
              break;
          }
          
          // 安全地设置localStorage
          try {
            localStorage.setItem(`apiLineage_${api.id}`, JSON.stringify(sampleLineageData));
          } catch (storageError) {
            console.warn(`无法保存API ${api.id}的血缘关系数据`, storageError);
          }
        }
      });
    } catch (error) {
      console.error('初始化血缘关系数据失败:', error);
    }
  };

  // 筛选相关状态
  const [methodFilters, setMethodFilters] = useState({});
  const [responseTimeFilter, setResponseTimeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterAccordionOpen, setIsFilterAccordionOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  // 分类编辑相关状态
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [parentCategory, setParentCategory] = useState('0');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [contextCategory, setContextCategory] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // 编辑模式状态
  const [editMode, setEditMode] = useState(false);

  // 血缘关系相关状态
  const [lineageDialogOpen, setLineageDialogOpen] = useState(false);
  const [selectedApiForLineage, setSelectedApiForLineage] = useState(null);
  const [apiImportDialogOpen, setApiImportDialogOpen] = useState(false);
  const [apiDetailDialogOpen, setApiDetailDialogOpen] = useState(false);

  // 订阅情况对话框相关状态
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [selectedApiForSubscription, setSelectedApiForSubscription] = useState(null);

  // 关闭编辑对话
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setCurrentCategory(null);
    setCategoryName('');
    setParentCategory('0');
  };

  // 打开删除确认对话
  const handleDeleteDialogOpen = (category) => {
    setCurrentCategory(category);
    setDeleteDialogOpen(true);
    handleCategoryMenuClose();
  };

  // 关闭删除确认对话
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setCurrentCategory(null);
  };

  // 保存分类编辑
  const handleSaveCategory = () => {
    if (!categoryName.trim()) return;
    
    // 创建新的分类数组
    let updatedCategories = [...categories];
    
    if (isAddMode) {
      // 添加新分类
      const newCategory = {
        id: `new-${Date.now()}`,
        name: categoryName,
        parentId: parentCategory,
        sort: 1,
        type: 1,
        typeName: '分类',
        classifications: []
      };
      
      if (parentCategory === '0') {
        // 添加到顶层
        updatedCategories.push(newCategory);
      } else {
        // 添加到子分类
        const addToParent = (cats) => {
          return cats.map(cat => {
            const catId = cat.id || cat.value;
            if (catId === parentCategory) {
              // 找到父分类，将新分类添加到其子分类中
              const childrenArray = cat.classifications || [];
              return {
                ...cat,
                classifications: [...childrenArray, newCategory]
              };
            } else if (cat.classifications && cat.classifications.length > 0) {
              // 递归查找子分类
              return {
                ...cat,
                classifications: addToParent(cat.classifications)
              };
            }
            return cat;
          });
        };
        
        updatedCategories = addToParent(updatedCategories);
      }
    } else {
      // 编辑现有分类
      const updateCategory = (cats) => {
        return cats.map(cat => {
          const catId = cat.id || cat.value;
          if (catId === (currentCategory.id || currentCategory.value)) {
            // 更新分类名称
            return {
              ...cat,
              name: categoryName,
              label: categoryName, // 兼容value/label格式
            };
          } else if (cat.classifications && cat.classifications.length > 0) {
            // 递归查找子分类
            return {
              ...cat,
              classifications: updateCategory(cat.classifications)
            };
          }
          return cat;
        });
      };
      
      updatedCategories = updateCategory(updatedCategories);
    }
    
    setCategories(updatedCategories);
    handleEditDialogClose();
  };

  // 删除分类
  const handleDeleteCategory = () => {
    if (!currentCategory) return;
    
    const categoryId = currentCategory.id || currentCategory.value;
    
    // 创建新的分类数组
    let updatedCategories = [...categories];
    
    // 删除分类的函数
    const deleteFromCategories = (cats) => {
      return cats.filter(cat => {
        const catId = cat.id || cat.value;
        if (catId === categoryId) {
          return false; // 排除要删除的分类
        }
        
        // 递归处理子分类
        if (cat.classifications && cat.classifications.length > 0) {
          cat.classifications = deleteFromCategories(cat.classifications);
        }
        
        return true;
      });
    };
    
    updatedCategories = deleteFromCategories(updatedCategories);
    setCategories(updatedCategories);
    handleDeleteDialogClose();
  };

  // 获取所有分类的扁平列表（用于下拉选择父分类）
  const getAllCategoriesFlat = (categories, level = 0, result = []) => {
    categories.forEach(category => {
      const categoryId = category.id || category.value;
      const categoryName = category.name || category.label;
      
      result.push({
        id: categoryId,
        name: '　'.repeat(level) + (level > 0 ? ' ' : '') + categoryName,
        level
      });
      
      if (category.classifications && category.classifications.length > 0) {
        getAllCategoriesFlat(category.classifications, level + 1, result);
      }
    });
    
    return result;
  };

  // 切换编辑模式
  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };

  // 递归渲染分类和子分类
  const renderCategories = (categories, level = 0) => {
    if (!categories) return null;
    
    return categories.map((category) => {
      const categoryId = category.id || category.value;
      const categoryName = category.name || category.label;
      const hasChildren = category.classifications && category.classifications.length > 0;
      const isExpanded = expandedCategories[categoryId];
      
      // 获取与此分类相关的API
      const categoryApis = filteredApis.filter(api => 
        api.category === categoryName || api.subCategory === categoryName
      );
      
      // 如果没有子分类且没有相关API，不显示
      if (!hasChildren && categoryApis.length === 0) return null;
      
      // 计算所有子分类的API总数
      const getNestedApiCount = (catList) => {
        if (!catList) return 0;
        let count = 0;
        
        catList.forEach(cat => {
          const catName = cat.name || cat.label;
          // 添加当前分类的API数量
          count += filteredApis.filter(api => 
            api.category === catName || api.subCategory === catName
          ).length;
          
          // 递归添加子分类的API数量
          if (cat.classifications && cat.classifications.length > 0) {
            count += getNestedApiCount(cat.classifications);
          }
        });
        
        return count;
      };
      
      const totalApiCount = hasChildren 
        ? categoryApis.length + getNestedApiCount(category.classifications)
        : categoryApis.length;
      
      let listItemClass = '';
      if (level === 1) listItemClass = classes.nestedItem;
      if (level === 2) listItemClass = classes.doubleNestedItem;
      
      return (
        <React.Fragment key={categoryId}>
          <ListItem 
            button 
            className={`${listItemClass} ${classes.categoryItemPrimary} ${categoryApis.some(api => selectedApi && api.id === selectedApi.id) ? classes.selectedItemPrimary : ''}`}
          >
            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              {hasChildren && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryToggle(categoryId);
                  }}
                >
                  {isExpanded ? <ExpandLess color="primary" /> : <ExpandMore />}
                </IconButton>
              )}
              <ListItemText 
                primary={
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {categoryName}
                    <span className={classes.categoryCountPrimary}>
                      {totalApiCount}
                    </span>
                  </span>
                }
                primaryTypographyProps={{ className: classes.categoryTextPrimary }}
                onClick={() => handleCategoryToggle(categoryId)}
              />
            </div>
            {editMode && (
              <div className={classes.categoryActions}>
                <Tooltip title="编辑">
                  <IconButton 
                    className={classes.actionButton}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditDialogOpen(category);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="删除">
                  <IconButton 
                    className={classes.actionButton}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDialogOpen(category);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="添加子分类">
                  <IconButton 
                    className={classes.actionButton}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditDialogOpen(category, true);
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </ListItem>
          
          {/* 显示此分类的相关API */}
          {categoryApis.length > 0 && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              {categoryApis.map(api => renderApiListItem(api, level))}
            </Collapse>
          )}
          
          {/* 递归渲染子分类*/}
          {hasChildren && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              {renderCategories(category.classifications, level + 1)}
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  // 处理分页变化
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    // 当切换页面时，取消选中的API
    setSelectedApi(null);
  };

  // 计算当前页应该显示的API，最0
  const getCurrentPageApis = () => {
    const startIndex = (page - 1) * rowsPerPage;
    const maxItemsPerPage = 10; // 每页最多显0
    const endIndex = Math.min(startIndex + maxItemsPerPage, filteredApis.length);
    return filteredApis.slice(startIndex, endIndex);
  };

  // 打开血缘关系对话框
  const handleOpenLineageDialog = (api, event) => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedApiForLineage(api);
    setLineageDialogOpen(true);
  };

  // 关闭血缘关系对话框
  const handleCloseLineageDialog = () => {
    setLineageDialogOpen(false);
  };

  // 打开API导入对话
  const handleOpenImportDialog = () => {
    setApiImportDialogOpen(true);
  };

  // 关闭API导入对话
  const handleCloseImportDialog = () => {
    setApiImportDialogOpen(false);
  };

  // 导入API成功后的处理
  const handleImportSuccess = () => {
    // 重新获取API列表
    const updatedApis = JSON.parse(localStorage.getItem('apis') || '[]');
    if (updatedApis.length > mockApis.length) {
      // 添加导入的API到mock列表
      mockApis = updatedApis;
      setFilteredApis(updatedApis);
    }
    setApiImportDialogOpen(false);
  };

  // 检查API是否有血缘关系数据
  const hasLineageData = (apiId) => {
    const lineageData = localStorage.getItem(`apiLineage_${apiId}`);
    if (!lineageData) return false;
    
    try {
      const parsedData = JSON.parse(lineageData);
      return (
        parsedData.upstream.length > 0 || 
        parsedData.downstream.length > 0 || 
        parsedData.users.length > 0
      );
    } catch (e) {
      return false;
    }
  };

  // 渲染API列表
  const renderApiListItem = (api, level = 0) => {
    const apiHasLineage = hasLineageData(api.id);
    
    return (
      <ListItem 
        button 
        key={api.id}
        className={`${level > 0 ? classes.nestedItem : ''} ${selectedApi && api.id === selectedApi.id ? classes.selectedItem : ''}`}
        onClick={() => handleSelectApi(api)}
      >
        <div className={classes.apiListItemContent}>
          <HttpIcon fontSize="small" style={{ marginRight: 8 }} />
          <ListItemText 
            primary={api.name} 
            secondary={
              <Chip 
                size="small"
                label={api.method}
                color={api.method === 'GET' ? 'primary' : 'secondary'}
                style={{ height: 20, fontSize: '0.7rem' }}
              />
            }
          />
          {apiHasLineage && (
            <Chip
              size="small"
              icon={<LineageIcon fontSize="small" />}
              label="血缘关系"
              variant="outlined"
              className={classes.lineageChip}
              color="primary"
            />
          )}
        </div>
      </ListItem>
    );
  };

  // 处理筛选和搜索
  useEffect(() => {
    let results = [...mockApis];
    
    // 搜索筛选
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(api => 
        api.name.toLowerCase().includes(query) || 
        api.description.toLowerCase().includes(query) ||
        api.category.toLowerCase().includes(query) ||
        api.subCategory.toLowerCase().includes(query) ||
        (api.endpoints && api.endpoints.some(endpoint => {
          if (typeof endpoint === 'string') {
            return endpoint.toLowerCase().includes(query);
          } else if (endpoint && typeof endpoint === 'object') {
            return (
              (endpoint.path && endpoint.path.toLowerCase().includes(query)) ||
              (endpoint.method && endpoint.method.toLowerCase().includes(query)) ||
              (endpoint.name && endpoint.name.toLowerCase().includes(query))
            );
          }
          return false;
        }))
      );
    }
    
    // 开放等级筛
    if (accessLevelFilter) {
      // 在实际应用中，这里应该基于API数据中的开放等级字段进行筛
      // 这里仅作为示例
      switch(accessLevelFilter) {
        case 'login':
          // 筛选登录开放的API
          results = results.filter(api => api.accessLevel === 'login' || api.id.includes('1'));
          break;
        case 'restricted':
          // 筛选受限开放的API
          results = results.filter(api => api.accessLevel === 'restricted' || api.id.includes('2'));
          break;
        case 'public':
          // 筛选完全开放的API
          results = results.filter(api => api.accessLevel === 'public' || api.id.includes('3'));
          break;
      }
    }
    
    // 数据领域筛
    if (dataFieldFilters.length > 0) {
      results = results.filter(api => 
        dataFieldFilters.some(field => 
          api.category === field || api.subCategory === field
        )
      );
    }
    
    // 主题分类筛
    if (themeFilters.length > 0) {
      results = results.filter(api => 
        themeFilters.some(theme => 
          api.category === theme || api.subCategory === theme
        )
      );
    }
    
    // 服务分类筛
    if (serviceFilters.length > 0) {
      results = results.filter(api => 
        serviceFilters.some(service => 
          api.category === service || api.subCategory === service
        )
      );
    }
    
    // 行业分类筛
    if (industryFilters.length > 0) {
      results = results.filter(api => 
        industryFilters.some(industry => 
          api.category === industry || api.subCategory === industry
        )
      );
    }
    
    // 方法筛
    const activeMethodFilters = Object.entries(methodFilters)
      .filter(([_, isActive]) => isActive)
      .map(([method]) => method);
    
    if (activeMethodFilters.length > 0) {
      results = results.filter(api => 
        activeMethodFilters.some(method => api.method.includes(method))
      );
    }
    
    // 响应时间筛
    if (responseTimeFilter !== 'all') {
      const range = responseTimeRanges.find(r => r.value === responseTimeFilter);
      if (range) {
        results = results.filter(api => {
          const responseTime = parseInt(api.responseTime);
          if (range.min && range.max) {
            return responseTime >= range.min && responseTime <= range.max;
          } else if (range.min) {
            return responseTime >= range.min;
          } else if (range.max) {
            return responseTime <= range.max;
          }
          return true;
        });
      }
    }
    
    // 日期筛
    if (startDate) {
      results = results.filter(api => 
        new Date(api.lastUpdated) >= new Date(startDate)
      );
    }
    
    if (endDate) {
      results = results.filter(api => 
        new Date(api.lastUpdated) <= new Date(endDate)
      );
    }
    
    setFilteredApis(results);
    
    // 当搜索或筛选条件改变时，重置到第一页
    setPage(1);
    
    // 更新活跃筛选条
    const newActiveFilters = [];
    
    // 添加开放等级筛选条
    if (accessLevelFilter) {
      let levelLabel = '';
      switch(accessLevelFilter) {
        case 'login':
          levelLabel = '登录开放';
          break;
        case 'restricted':
          levelLabel = '受限开放';
          break;
        case 'public':
          levelLabel = '完全开放';
          break;
      }
      
      newActiveFilters.push({
        type: 'accessLevel',
        label: `开放等级: ${levelLabel}`,
        onClear: () => setAccessLevelFilter(null)
      });
    }
    
    // 添加数据领域筛选条
    if (dataFieldFilters.length > 0) {
      newActiveFilters.push({
        type: 'dataField',
        label: `数据领域: ${dataFieldFilters.join(', ')}`,
        onClear: () => setDataFieldFilters([])
      });
    }
    
    // 添加主题分类筛选条
    if (themeFilters.length > 0) {
      newActiveFilters.push({
        type: 'theme',
        label: `主题分类: ${themeFilters.join(', ')}`,
        onClear: () => setThemeFilters([])
      });
    }
    
    // 添加服务分类筛选条
    if (serviceFilters.length > 0) {
      newActiveFilters.push({
        type: 'service',
        label: `服务分类: ${serviceFilters.join(', ')}`,
        onClear: () => setServiceFilters([])
      });
    }
    
    // 添加行业分类筛选条
    if (industryFilters.length > 0) {
      newActiveFilters.push({
        type: 'industry',
        label: `行业分类: ${industryFilters.join(', ')}`,
        onClear: () => setIndustryFilters([])
      });
    }
    
    // 添加方法筛选条
    if (activeMethodFilters.length > 0) {
      newActiveFilters.push({
        type: 'method',
        label: `方法: ${activeMethodFilters.join(', ')}`,
        onClear: () => {
          const resetFilters = {...methodFilters};
          activeMethodFilters.forEach(method => {
            resetFilters[method] = false;
          });
          setMethodFilters(resetFilters);
        }
      });
    }
    
    // 添加响应时间筛选条
    if (responseTimeFilter !== 'all') {
      const range = responseTimeRanges.find(r => r.value === responseTimeFilter);
      newActiveFilters.push({
        type: 'responseTime',
        label: `响应时间: ${range.label}`,
        onClear: () => setResponseTimeFilter('all')
      });
    }
    
    // 添加日期筛选条
    if (startDate || endDate) {
      newActiveFilters.push({
        type: 'date',
        label: `更新日期: ${startDate ? startDate : '始至'} - ${endDate ? endDate : '现在'}`,
        onClear: () => {
          setStartDate('');
          setEndDate('');
        }
      });
    }
    
    setActiveFilters(newActiveFilters);
    
  }, [
    searchQuery, 
    methodFilters, 
    responseTimeFilter, 
    startDate, 
    endDate, 
    accessLevelFilter,
    dataFieldFilters,
    themeFilters,
    serviceFilters,
    industryFilters
  ]);

  // 处理分类展开/收起
  const handleCategoryToggle = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  // 选择API进行展示
  const handleSelectApi = (api) => {
    setSelectedApi(api);
    setApiDetailDialogOpen(true);
  };

  // 打开分类菜单
  const handleCategoryMenuOpen = (event, category) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setContextCategory(category);
  };

  // 关闭分类菜单
  const handleCategoryMenuClose = () => {
    setMenuAnchorEl(null);
    setContextCategory(null);
  };

  // 打开编辑对话
  const handleEditDialogOpen = (category, isAdd = false) => {
    setCurrentCategory(category);
    setIsAddMode(isAdd);
    
    if (!isAdd) {
      setCategoryName(category.name || category.label);
      setParentCategory(category.parentId || '0');
    } else {
      setCategoryName('');
      setParentCategory(category ? (category.id || category.value) : '0');
    }
    
    setEditDialogOpen(true);
    handleCategoryMenuClose();
  };

  // 获取API的订阅者数
  const getApiSubscribers = (apiId) => {
    // 模拟从订阅关系中获取数据
    // 实际项目中，这应该是从API或状态管理中获取的数据
    const mockSubscriptions = {
      'api1': [
        { 
          team: '数据科学团队', 
          userId: 'user1', 
          userName: '张小明',
          role: '数据分析师',
          email: 'zhang.xiaoming@company.com',
          subscriptionDate: '2023-05-10' 
        },
        { 
          team: '营销团队', 
          userId: 'user2', 
          userName: '李小红',
          role: '营销经理',
          email: 'li.xiaohong@company.com',
          subscriptionDate: '2023-05-12' 
        },
        { 
          team: '数据科学团队', 
          userId: 'user3', 
          userName: '王小伟',
          role: '高级数据工程师',
          email: 'wang.xiaowei@company.com',
          subscriptionDate: '2023-05-15' 
        }
      ],
      'api2': [
        { 
          team: '财务团队', 
          userId: 'user4', 
          userName: '陈小丽',
          role: '财务专员',
          email: 'chen.xiaoli@company.com',
          subscriptionDate: '2023-05-08' 
        },
        { 
          team: '客户服务', 
          userId: 'user5', 
          userName: '刘小强',
          role: '客服主管',
          email: 'liu.xiaoqiang@company.com',
          subscriptionDate: '2023-05-11' 
        }
      ],
      'api3': [
        { 
          team: '产品团队', 
          userId: 'user6', 
          userName: '赵小敏',
          role: '产品经理',
          email: 'zhao.xiaomin@company.com',
          subscriptionDate: '2023-05-09' 
        },
        { 
          team: '开发团队', 
          userId: 'user7', 
          userName: '孙小军',
          role: '前端开发工程师',
          email: 'sun.xiaojun@company.com',
          subscriptionDate: '2023-05-13' 
        },
        { 
          team: '测试团队', 
          userId: 'user8', 
          userName: '周小雨',
          role: '测试工程师',
          email: 'zhou.xiaoyu@company.com',
          subscriptionDate: '2023-05-14' 
        },
        { 
          team: '产品团队', 
          userId: 'user9', 
          userName: '吴小飞',
          role: '产品设计师',
          email: 'wu.xiaofei@company.com',
          subscriptionDate: '2023-05-16' 
        }
      ],
      'api-4': [
        { 
          team: '支付团队', 
          userId: 'user10', 
          userName: '许小华',
          role: '支付架构师',
          email: 'xu.xiaohua@company.com',
          subscriptionDate: '2023-05-07' 
        },
        { 
          team: '风控团队', 
          userId: 'user11', 
          userName: '马小龙',
          role: '风控专家',
          email: 'ma.xiaolong@company.com',
          subscriptionDate: '2023-05-12' 
        },
        { 
          team: '财务团队', 
          userId: 'user12', 
          userName: '黄小玲',
          role: '财务主管',
          email: 'huang.xiaoling@company.com',
          subscriptionDate: '2023-05-18' 
        }
      ],
      'api-5': [
        { 
          team: '电商团队', 
          userId: 'user13', 
          userName: '林小波',
          role: '电商运营',
          email: 'lin.xiaobo@company.com',
          subscriptionDate: '2023-05-06' 
        },
        { 
          team: '推荐算法团队', 
          userId: 'user14', 
          userName: '郑小艳',
          role: '算法工程师',
          email: 'zheng.xiaoyan@company.com',
          subscriptionDate: '2023-05-10' 
        }
      ]
    };
    
    return mockSubscriptions[apiId] || [];
  };

  // 获取不同的团队部门数量
  const getUniqueTeams = (subscribers) => {
    if (!subscribers || subscribers.length === 0) return [];
    
    // 使用Set来确保团队名称唯一
    const uniqueTeams = [...new Set(subscribers.map(sub => sub.team))];
    return uniqueTeams;
  };

  // 渲染订阅者指示器
  const renderSubscribers = (api) => {
    if (!api || !api.id) return null;
    
    const subscribers = getApiSubscribers(api.id);
    const uniqueTeams = getUniqueTeams(subscribers);
    const totalSubscribers = subscribers.length;
    
    if (totalSubscribers === 0) {
      return (
        <Tooltip title="暂无团队订阅，点击查看详情">
          <IconButton
            size="small"
            className={classes.apiCardAction}
            onClick={(e) => handleOpenSubscriptionDialog(api, e)}
          >
            <div className={classes.noSubscribersIndicator}>
              <TeamIcon fontSize="small" color="disabled" />
              <Typography variant="caption" color="textSecondary">0</Typography>
            </div>
          </IconButton>
        </Tooltip>
      );
    }
    
    // 根据唯一团队数量显示不同的图标颜色和工具提示
    return (
      <Tooltip 
        title={
          <div>
            <Typography variant="caption" style={{ fontWeight: 'bold' }}>
              {totalSubscribers}个订阅/ {uniqueTeams.length}个团队
            </Typography>
            <div>
              {uniqueTeams.slice(0, 3).map((team, idx) => (
                <div key={idx}>{team} ({subscribers.filter(s => s.team === team).length})</div>
              ))}
              {uniqueTeams.length > 3 && <div>还有 {uniqueTeams.length - 3} 个团队...</div>}
            </div>
            <Typography variant="caption" style={{ marginTop: 8, fontStyle: 'italic' }}>
              点击查看详细信息
            </Typography>
          </div>
        }
      >
        <IconButton
          size="small"
          className={classes.apiCardAction}
          onClick={(e) => handleOpenSubscriptionDialog(api, e)}
        >
          <div className={classes.subscribersIndicator}>
            <TeamIcon 
              fontSize="small" 
              color={uniqueTeams.length > 2 ? "primary" : "action"} 
            />
            <Typography variant="caption" color="textPrimary">
              {uniqueTeams.length}
            </Typography>
          </div>
        </IconButton>
      </Tooltip>
    );
  };

  // 渲染API卡片
  const renderApiCard = (api) => {
    if (!api) return null;
    
    const apiHasLineage = hasLineageData(api.id);
    const methods = api.method ? api.method.split('/') : [];
    
    return (
      <Card 
        key={api.id} 
        className={classes.apiCard}
      >
        <div className={classes.apiCardTopBar}></div>
        <CardContent className={classes.apiCardContent}>
          <div className={classes.apiCardHeader}>
            <div>
              <Typography variant="h6" className={classes.apiTitle}>
                {api.name}
                {apiHasLineage && (
                  <Tooltip title="API 有血缘关系数据">
                    <LineageIcon fontSize="small" className={classes.lineageIcon} style={{ marginLeft: 8 }} />
                  </Tooltip>
                )}
              </Typography>
              <Typography variant="body2" color="textSecondary" className={classes.apiDescription}>
                {api.description}
              </Typography>
            </div>
            <div className={classes.methodsContainer}>
              {methods.map((method, idx) => (
                <Chip 
                  key={idx}
                  label={method} 
                  color={method === 'GET' ? 'primary' : method === 'POST' ? 'secondary' : 'default'} 
                  size="small"
                  className={classes.methodChip}
                />
              ))}
            </div>
          </div>
          
          {/* 显示端点信息 */}
          {api.endpoints && api.endpoints.length > 0 && (
            <div className={classes.apiEndpointsContainer}>
              <div className={classes.apiEndpointLabel}>
                <CodeIcon fontSize="small" />
                <Typography variant="caption">
                  端点:
                </Typography>
              </div>
              <div className={classes.apiEndpointChips}>
                {api.endpoints.slice(0, 3).map((endpoint, idx) => (
                  <Chip
                    key={idx}
                    label={typeof endpoint === 'string' ? endpoint : `${endpoint.method} ${endpoint.path}`}
                    size="small"
                    variant="outlined"
                    className={classes.endpointChip}
                  />
                ))}
                {api.endpoints.length > 3 && (
                  <Tooltip title={api.endpoints.slice(3).map(endpoint => 
                    typeof endpoint === 'string' ? endpoint : `${endpoint.method} ${endpoint.path}`
                  ).join(', ')}>
                    <Chip
                      label={`+${api.endpoints.length - 3}个`}
                      size="small"
                      className={classes.endpointChip}
                      color="default"
                    />
                  </Tooltip>
                )}
              </div>
            </div>
          )}
          
          <div className={classes.apiCardDetails}>
            <div className={classes.apiCardDetailItem}>
              <AccessTimeIcon className={classes.apiCardIcon} />
              <Typography variant="body2">{api.responseTime}</Typography>
            </div>
            <div className={classes.apiCardDetailItem}>
              <EventIcon className={classes.apiCardIcon} />
              <Typography variant="body2">{new Date(api.lastUpdated).toLocaleDateString()}</Typography>
            </div>
            <div className={classes.apiCardDetailItem}>
              <PersonIcon className={classes.apiCardIcon} />
              <Typography variant="body2">{api.owner || '未分配'}</Typography>
            </div>
          </div>
          
          <div className={classes.apiCardFooter}>
            <div className={classes.apiCardCategories}>
              {api.category && (
                <Tooltip title="分类">
                  <Chip 
                    size="small" 
                    label={api.category} 
                    className={classes.categoryChip}
                    color="primary"
                    variant="outlined"
                    icon={<CategoryOutlinedIcon fontSize="small" />}
                  />
                </Tooltip>
              )}
              {api.subCategory && (
                <Tooltip title="子分类">
                  <Chip 
                    size="small" 
                    label={api.subCategory} 
                    className={classes.categoryChip}
                    color="secondary"
                    variant="outlined"
                    icon={<LabelIcon fontSize="small" />}
                  />
                </Tooltip>
              )}
            </div>
            <div className={classes.apiCardActions}>
              <Tooltip title="查看API详情">
                <IconButton 
                  size="small" 
                  className={classes.apiCardAction}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectApi(api);
                  }}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {renderSubscribers(api)}
              <Tooltip title="查看API血缘关系">
                <IconButton 
                  size="small" 
                  className={classes.apiCardAction}
                  onClick={(e) => handleOpenLineageDialog(api, e)}
                >
                  <LineageIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 使用ApiCategoryList渲染分类
  const renderCategoryTree = (categories) => {
    // 转换数据格式以适配新组
    const transformedCategories = categories.map(category => ({
      id: category.id || category.value,
      name: category.name || category.label,
      typeName: category.typeName || '分类',
      apiAmount: category.apiAmount || 0,
      childAmount: category.childAmount || 0,
      classifications: category.classifications || []
    }));

    return (
      <div className={classes.categoryListContainer}>
        <ApiCategoryList 
          categories={transformedCategories}
          onCategoryClick={(category) => handleCategorySelect(category)}
          editMode={editMode}
          onEdit={(category) => handleEditDialogOpen(category)}
          onDelete={(category) => handleDeleteDialogOpen(category)}
          onAddSubCategory={(category) => handleEditDialogOpen(category, true)}
        />
        {editMode && (
          <Button
            fullWidth
            startIcon={<AddIcon />}
            onClick={() => handleEditDialogOpen(null, true)}
            className={classes.addRootCategoryButton}
          >
            添加根分类
          </Button>
        )}
      </div>
    );
  };

  // 处理树节点展开/折叠
  const handleNodeToggle = (event, nodeIds) => {
    // 将展开的节点ID转换为展开状态对
    const newExpandedState = {};
    nodeIds.forEach(id => {
      // 跳过API节点（以'api-'开头的ID）
      if (!id.startsWith('api-') && id !== 'add-root-category') {
        newExpandedState[id] = true;
      }
    });
    
    // 更新展开状态
    setExpandedCategories(newExpandedState);
  };

  // 处理分类选择
  const handleCategorySelect = (category) => {
    const categoryId = category.id || category.value;
    const categoryName = category.name || category.label;
    
    // 切换当前分类的展开状态
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
    
    // 这里可以添加额外的分类选择逻辑，如过滤API列表
  };

  useEffect(() => {
    // 初始化展开状态，默认展开根级分类
    const defaultExpanded = {};
    categories.forEach(category => {
      const categoryId = category.id || category.value;
      defaultExpanded[categoryId] = true;
    });
    setExpandedCategories(defaultExpanded);
  }, [categories]); // 只在categories变化时执行

  const handleCloseApiDetailDialog = () => {
    setApiDetailDialogOpen(false);
  };

  // 打开订阅情况对话框
  const handleOpenSubscriptionDialog = (api, event) => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedApiForSubscription(api);
    setSubscriptionDialogOpen(true);
  };

  // 关闭订阅情况对话框
  const handleCloseSubscriptionDialog = () => {
    setSubscriptionDialogOpen(false);
    setSelectedApiForSubscription(null);
  };

  return (
    <div className={classes.root}>
      {/* 头部区域 */}
      <Paper className={classes.headerSection} elevation={0}>
        <div className={classes.headerContent}>
          <Typography variant="h3" className={classes.bannerTitle}>
            API 目录
          </Typography>
          <Typography variant="subtitle1" className={classes.headerSubtitle}>
            探索和管理您的API集合，通过分类浏览、搜索并查看详细信息
          </Typography>
          
          <div className={classes.searchContainer}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="搜索API名称、描述或分类..."
              classes={{
                root: classes.inputRoot,
                input: classes.searchInput,
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CloudUploadIcon />}
            className={classes.importButtonHeader}
            onClick={handleOpenImportDialog}
          >
            导入API
          </Button>
        </div>
        
        {/* API总数统计 - 左下角 */}
        <ApiTotalStats totalCount={filteredApis.length} />
      </Paper>

      <Container maxWidth="xl">
        {/* 顶部筛选器区域 */}
        <Paper style={{ marginBottom: 24, padding: 0 }} elevation={2}>
          <ApiFilter
            // 筛选状态
            accessLevelFilter={accessLevelFilter}
            dataFieldFilters={dataFieldFilters}
            themeFilters={themeFilters}
            serviceFilters={serviceFilters}
            industryFilters={industryFilters}
            methodFilters={methodFilters}
            responseTimeFilter={responseTimeFilter}
            startDate={startDate}
            endDate={endDate}
            activeFilters={activeFilters}
            allApiMethods={allApiMethods}
            
            // 筛选处理函数
            onAccessLevelFilterChange={handleAccessLevelFilterChange}
            onFilterChange={handleFilterChange}
            onMethodFilterChange={handleMethodFilterChange}
            onResponseTimeFilterChange={setResponseTimeFilter}
            onDateChange={(field, value) => {
              if (field === 'startDate') setStartDate(value);
              if (field === 'endDate') setEndDate(value);
            }}
            onClearAllFilters={handleClearAllFilters}
          />
        </Paper>

        <Grid container spacing={3}>
          {/* 左侧 - API分类面板 */}
          <Grid item xs={12} md={3} lg={3}>
            <Paper className={classes.leftPanel}>
              <div className={classes.stickyListHeader}>
                <Typography className={classes.headerTitleText}>
                  <CategoryIcon style={{ marginRight: 8 }} /> API分类
                </Typography>
                <div className={classes.editModeSwitch}>
                  <Typography className={classes.editModeLabel}>编辑</Typography>
                  <Switch
                    size="small"
                    checked={editMode}
                    onChange={handleEditModeToggle}
                    color="primary"
                  />
                </div>
              </div>
              <div className={classes.categoryListContainer}>
                {renderCategoryTree(categories)}
              </div>
            </Paper>
          </Grid>

          {/* 右侧 - API列表面板 */}
          <Grid item xs={12} md={9} lg={9}>
            <Paper className={classes.rightPanel}>
              {/* API统计信息栏 */}
              <Box className={classes.rightPanelHeader}>
                <Typography variant="h6" className={classes.rightPanelTitle}>
                  API列表
                </Typography>
                <Box className={classes.rightPanelStats}>
                  <Chip 
                    icon={<CodeIcon />} 
                    label={`共 ${filteredApis.length} 个API`}
                    className={classes.rightPanelStatChip}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip 
                    icon={<VisibilityIcon />} 
                    label={`${filteredApis.filter(api => api.accessLevel === 'public').length} 个公开`}
                    className={classes.rightPanelStatChip}
                    color="secondary"
                    variant="outlined"
                  />
                  {searchQuery && (
                    <Chip 
                      icon={<SearchIcon />} 
                      label={`搜索: "${searchQuery}"`}
                      className={classes.rightPanelStatChip}
                      onDelete={() => setSearchQuery('')}
                      color="default"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
              
              {/* 始终显示API列表 */}
              <div>
                <Grid container spacing={3} className={classes.apiGridContainer}>
                  {getCurrentPageApis().map((api) => (
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={api.id} className={classes.apiGridItem}>
                      {renderApiCard(api)}
                    </Grid>
                  ))}
                </Grid>

                {filteredApis.length > 0 ? (
                  <div className={classes.paginationContainer}>
                    <Typography className={classes.paginationInfo}>
                      显示 {(page - 1) * 10 + 1} - {Math.min(page * 10, filteredApis.length)} 项，共 {filteredApis.length} 项
                    </Typography>
                    <Pagination 
                      count={Math.ceil(filteredApis.length / 10)} 
                      page={page}
                      onChange={handlePageChange}
                      color="primary" 
                      showFirstButton 
                      showLastButton
                    />
                  </div>
                ) : (
                  <div className={classes.emptyState}>
                    <FilterListIcon className={classes.emptyStateIcon} />
                    <Typography variant="h6">未找到匹配的API</Typography>
                    <Typography variant="body2" className={classes.emptyStateText}>
                      没有找到符合当前筛选条件的API。尝试调整筛选条件或清除所有筛选器
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<ClearIcon />}
                      style={{ marginTop: 16 }}
                      onClick={() => {
                        setAccessLevelFilter(null);
                        setDataFieldFilters([]);
                        setThemeFilters([]);
                        setServiceFilters([]);
                        setIndustryFilters([]);
                        setMethodFilters({});
                        setResponseTimeFilter('all');
                        setStartDate('');
                        setEndDate('');
                      }}
                    >
                      清除所有筛选器
                    </Button>
                  </div>
                )}
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* 分类编辑对话*/}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>{isAddMode ? '添加分类' : '编辑分类'}</DialogTitle>
        <DialogContent>
          <form className={classes.dialogForm}>
            <TextField
              label="分类名称"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              fullWidth
              required
            />
            {isAddMode && (
              <FormControl fullWidth>
                <InputLabel>父分类</InputLabel>
                <Select
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                >
                  <MenuItem value="0">
                    <em>顶级分类</em>
                  </MenuItem>
                  {getAllCategoriesFlat(categories).map((cat) => (
                    <MenuItem key={cat.id} value={cat.id} disabled={cat.id === (currentCategory?.id || currentCategory?.value)}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            取消
          </Button>
          <Button onClick={handleSaveCategory} color="primary" variant="contained" disabled={!categoryName.trim()}>
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 删除确认对话*/}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            您确定要删除分类 "{currentCategory?.name || currentCategory?.label}" 吗？
            {currentCategory?.classifications?.length > 0 && (
              <span> 此操作也将删除所有子分类</span>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            取消
          </Button>
          <Button onClick={handleDeleteCategory} color="secondary">
            删除
          </Button>
        </DialogActions>
      </Dialog>

      {/* 血缘关系对话框 */}
      {selectedApiForLineage && (
        <ApiLineage
          open={lineageDialogOpen}
          onClose={handleCloseLineageDialog}
          apiId={selectedApiForLineage.id}
          apiName={selectedApiForLineage.name}
        />
      )}

      {/* API导入对话*/}
      <ApiImportDialog
        open={apiImportDialogOpen}
        onClose={handleCloseImportDialog}
        onImportSuccess={handleImportSuccess}
      />

      {/* API详情对话*/}
      <ApiDetailDialog
        open={apiDetailDialogOpen}
        onClose={handleCloseApiDetailDialog}
        api={selectedApi}
      />

      {/* 订阅情况对话框 */}
      <ApiSubscriptionDialog
        open={subscriptionDialogOpen}
        onClose={handleCloseSubscriptionDialog}
        api={selectedApiForSubscription}
        subscribers={selectedApiForSubscription ? getApiSubscribers(selectedApiForSubscription.id) : []}
      />
    </div>
  );
};

export default ApiCatalog; 
