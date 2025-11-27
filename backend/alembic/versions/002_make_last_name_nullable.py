"""make last_name nullable

Revision ID: 002_make_last_name_nullable
Revises: 001_initial_migration
Create Date: 2025-11-27 16:51:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002_make_last_name_nullable'
down_revision = '001_initial_migration'
branch_labels = None
depends_on = None


def upgrade():
    """Make last_name column nullable to support single-name users"""
    # For PostgreSQL
    op.alter_column('users', 'last_name',
               existing_type=sa.VARCHAR(length=50),
               nullable=True)


def downgrade():
    """Revert last_name to non-nullable"""
    # For PostgreSQL
    op.alter_column('users', 'last_name',
               existing_type=sa.VARCHAR(length=50),
               nullable=False)
