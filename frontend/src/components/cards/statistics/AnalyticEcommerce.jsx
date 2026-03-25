import PropTypes from 'prop-types';
import { Chip, Grid, Stack, Typography, Box, Card, CardContent } from '@mui/material';
import RiseOutlined from '@ant-design/icons/RiseOutlined';
import FallOutlined from '@ant-design/icons/FallOutlined';

// Styling for the icons
const iconSX = { fontSize: '0.75rem', marginLeft: 0, marginRight: 0 };

export default function AnalyticEcommerce({
  color = 'primary', 
  title, 
  count, 
  percentage, 
  isLoss, 
  extra 
}) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        padding: 2,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 8,
        },
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <Typography variant="h4" color="inherit" sx={{ fontWeight: 700 }}>
                {count}
              </Typography>
            </Grid>
            {percentage !== undefined && (
              <Grid item>
                <Chip
                  variant="filled"
                  color={color}
                  icon={isLoss ? <FallOutlined style={iconSX} /> : <RiseOutlined style={iconSX} />}
                  label={`${percentage}%`}
                  sx={{
                    fontWeight: 600,
                    pl: 1,
                    pr: 1,
                    fontSize: '0.875rem',
                    height: '28px',
                    alignSelf: 'center',
                    backgroundColor: `${color}.light`,
                  }}
                  size="small"
                />
              </Grid>
            )}
          </Grid>
        </Stack>
        <Box sx={{ pt: 1.25 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 400 }}>
            {extra && (
              <>
                <Typography variant="caption" sx={{ color: `${color}.main`, fontWeight: 600 }}>
                  {extra}
                </Typography>{' '}
                this year
              </>
            )}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string.isRequired,
  count: PropTypes.string.isRequired,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.string,
};
